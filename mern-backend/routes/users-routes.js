const express = require('express');
const { check, body } = require('express-validator');

const userController = require('../controllers/users-controllers');
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', userController.getUsers);

router.post(
    '/signup',
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').notEmpty(),
        check('username').notEmpty()
    ],
    userController.createUser);

router.post(
    '/login',
    userController.loginUser)

module.exports = router