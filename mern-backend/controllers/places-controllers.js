const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoosee = require('mongoose');

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require('../models/user');
const getCoordinates = require("../util/location");
const { default: mongoose } = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for provided place id.", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    return next(
      new HttpError("Something went wrong! Could not find place", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for provided user id.", 404)
    );
  }

  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError(
        "Invalid input passed to following fields: " +
          errors
            .array()
            .map((error) => error.path)
            .join(", ") +
          ". Please Check your data",
        422
      )
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://picsum.photos/200/300",
    creator,
  });

  let user;
  try{
    user = await User.findById(creator)
  } catch (err) {
    return next(new HttpError('Creating place failed. Please try again', 500))
  }

  if(!user){
    return next(new HttpError("Could not find user for provided Id.", 404));
  }

  let result;
  try {
    const session = await mongoosee.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session});
    user.places.push(createdPlace);
    await user.save({ session: session});
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Cannot create place.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Fields", 422));
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.updateOne(
      { _id: placeId },
      { title, description }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong! Could not update place"));
  }

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError('Something went wrong! Could not delete place'))
  }
console.log(place)
  if (!place) {
    return next(new HttpError('Could not find place to delete', 404));
  }

  try{
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({session: session});
    place.creator.places.pull(place);
    await place.creator.save({session: session});
    await session.commitTransaction();
  } catch (err) {
    console.log(err.message)
    return next(new HttpError('Something went wrong! Could not delete place'))
  }

  res.status(200).json({ message: `Place with id ${placeId} deleted` });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
