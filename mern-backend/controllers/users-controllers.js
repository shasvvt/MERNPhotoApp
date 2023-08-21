const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }
  const { name, email, username, password, image } = req.body;

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

  let hashedPassword;
  try {
  hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again', 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    username,
    password: hashedPassword,
    places : [],
    image : req.file.path
  });

  let result;
  try {
    result = await createdUser.save();
  } catch (err) {
    const error = new HttpError("Something went wrong! Sign up failed", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
      );
  } catch (err) {
    const error = new HttpError('Sign up failed, pleasr try again later.');
    return next(error);
  }
  

  res.status(201).json({ user: createdUser.id, email: createdUser.email, token: token });
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

  let isValidPassword = false;
  try {
   isValidPassword = await bcrypt.compare(password, user.password);  
  } catch (err) {
    const error = new HttpError('Could not log you in, please check yor credentials and try again.', 500);
    return next(error);
  }

  if(!isValidPassword) {
    const error = new HttpError('Invalid Credentials.', 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
      );
  } catch (err) {
    const error = new HttpError('Login failed, please try again later.');
    return next(error);
  }

  res.json({
    userId: user.id,
    email: user.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;
