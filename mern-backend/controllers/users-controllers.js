const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 1,
    name: {
      firstName: "Terry",
      lastName: "Medhurst",
    },
    email: "terry.medhurst@email.com",
    dob: new Date(),
    username: "ninja725",
    password: "password"
  }
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS;
  res.json(users);
}

const createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }
  const { fullName, email, dob, username, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email || u.username === username)

  if (hasUser) {
    throw new HttpError("Cannot create user. Email/Username already exist.", 422)
  }

  const createdUser = {
    id: uuid(),
    name: fullName,
    email,
    dob,
    username,
    password
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError("Invalid inputs passed.", 422);
  }
  const { username, password } = req.body;

  const loggedinUser = DUMMY_USERS.find((u) => u.username === username);

  if (loggedinUser) {
    if (loggedinUser.password === password) {
      res.status(200).json({ message: `user ${username} logged in` });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;