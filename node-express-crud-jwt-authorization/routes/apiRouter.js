const express = require('express');
const router = express.Router();
const UsersController = require('../controller/UsersController');

const auth = require("../middleware/auth");
router
    .route("/users/:id")
        .get( auth, UsersController.getUserById)
        .patch(auth, UsersController.updateUser)
        .delete(auth, UsersController.deleteUser);

router
    .route("/login")
        .post(UsersController.login);

router
    .route("/logout")
        .post(auth, UsersController.logout);

router
    .route("/users")
        .post(UsersController.createUser);

module.exports = router;