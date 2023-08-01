const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); //removes password field
  } catch (err) {
    return next(new HttpError("Something went wrong! Cannot get users.", 500));
  }
  res.status(200).json({users: users.map(user => user.toObject({getters: true}))});
};

const createUser = async (req, res, next) => {
  console.log('here')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }
  const { name, email, username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("User with email/username already exists. Please use a different email/username or login instead", 422)
    );
  }

  const createdUser = new User({
    name,
    email,
    username,
    password,
    places : [],
  });

  let result;
  try {
    result = await createdUser.save();
  } catch (err) {
    const error = new HttpError("Something went wrong! Sign up failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed.", 422));
  }
  const { username, password } = req.body;
  console.log(req.body)
  let user;
  try {
    user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
  } catch (err) {
    return next(new HttpError("Cannot log in. Please try again later", 500));
  }
  if (!user) {
    return next(
      new HttpError("User does not exist. Please sign up instead", 403)
    );
  }

  if (user.password === password) {
    res.status(200).json({ message: `user ${username} logged in`, user: user.toObject({getters: true})});
  } else {
    return next(new HttpError('Invalid credentials', 401))
  }
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;
