const express = require('express');
const { check, param } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlacesByUserId);

//register check-auth as a middleware
router.use(checkAuth);

router.post(
    '/', 
    fileUpload.single('image'),
    [
        check('title').notEmpty(),
        check('description').isLength({min: 5}),
        check('address').notEmpty()
    ], 
    placesControllers.createPlace);

router.patch(
    '/:pid', 
    [
        check('title').notEmpty(),
        check('description').isLength({ min: 5}),
    ],
    placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

router.patch('/:pid/like', placesControllers.createLike);

router.get('/:pid/comments', placesControllers.getComments);

router.patch('/:pid/comments', placesControllers.createComment);

router.delete('/:pid/comments/:commentid', placesControllers.deleteComment);

module.exports = router;