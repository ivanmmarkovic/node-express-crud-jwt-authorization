
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router 
    .route('/login')
        .post(AuthController.loginController);


module.exports = router;