const {v4: uuid} = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 1,
        name: {
            firstName: "Terry",
            lastName: "Medhurst",
        },
        email: "terry.medhurst@madarchod.com",
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
    const {fullName, email, dob, username, password} = req.body;

    const createdUser = {
        id: uuid(),
        name: fullName,
        email,
        dob,
        username,
        password
    };

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
};

const loginUser = (req, res, next) => {
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