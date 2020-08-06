
var express = require('express');
var router = express.Router();

const usersCtrl = require('../controllers/usersController');
let {jwtAuth} = require('../middleware/auth');

router
    .route('/users')
        .get(usersCtrl.findAll)
        .post(usersCtrl.create);


router
    .route('/users/:id')
        .get(usersCtrl.findById)
        .patch(jwtAuth, usersCtrl.patchById)
        .delete(jwtAuth, usersCtrl.deletebyId);

router
    .route('/login')
        .post(usersCtrl.login);

module.exports = router;
