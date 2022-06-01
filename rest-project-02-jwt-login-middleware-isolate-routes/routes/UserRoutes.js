

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/AuthMiddleware');

router 
    .route('/users')
        .post(UserController.createUser)
        .get(UserController.getAllUsers);

router 
    .route('/users/:id')
        .get(UserController.getUserById)
        .patch(authMiddleware, UserController.patchUserById)
        .delete(authMiddleware, UserController.deleteUserById);


module.exports = router;