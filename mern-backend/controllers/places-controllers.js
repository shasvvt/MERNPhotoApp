const {v4: uuid} = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinates = require('../util/location')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Eifel Tower',
        description: 'Eiffel Tower of Paris',
        location: {
            lat: '48.8583735',
            lon: '2.2896104'
        },
        address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
        creator: 'u1'
    }
]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId});

    if(!place){
        throw new HttpError('Could not find a place for provided place id.', 404);
    }

    res.json({place});
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(u => {
        return u.creator === userId
    });

    if(!places|| places.length === 0){
        return next(new HttpError('Could not find places for provided user id.', 404));
     }

    res.json({places})
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid input passed to following fields: " + errors.array().map(error => error.path).join(", ") + ". Please Check your data", 422)); 
    }
    
    const {title, description, address, creator} = req.body;

    let coordinates;
    try{
        coordinates = await getCoordinates(address);
    }
    catch(error){
        return next(error);
    }

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        throw new HttpError("Invalid Fields", 422)
    }
    const placeId = req.params.pid;
    const {title, description} = req.body;

    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
    const idx = DUMMY_PLACES.findIndex(p => p.id === placeId );

    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[idx] = updatedPlace;

    res.status(200).json({places: updatedPlace})
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const hasPlace = DUMMY_PLACES.find( p => p.id === placeId);
    if(!hasPlace){
        throw new HttpError("Cannot find place with provided id", 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: `Place with id ${placeId} deleted`})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;