const express = require('express');
const { check, body } = require('express-validator');

const userController = require('../controllers/users-controllers');
const HttpError = require('../models/http-error');

const router = express.Router();

router.get('/', userController.getUsers);

router.post(
    '/signup',
    [
        check('fullName.firstName').notEmpty(),
        check('fullName.lastName').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        body('dob').notEmpty().custom((value) => {
            const birthDate = new Date(value);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            if(age < 18){
                throw new HttpError("Age must be at least 18 years.", 422);
            }
            return true;
        }),
        check('password').notEmpty(),
        check('username').notEmpty()
    ],
    userController.createUser);

router.post(
    '/login',
    userController.loginUser)

module.exports = router