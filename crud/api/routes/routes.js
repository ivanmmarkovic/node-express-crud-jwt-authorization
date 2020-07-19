var express = require('express');
var router = express.Router();

const authCtrl = require('../controllers/authentication');
const usersCtrl = require('../controllers/users');

router
    .route('/users')
        .get(usersCtrl.getAll);


router
    .route('/users/:username')
        .get(usersCtrl.getOne)
        .put(usersCtrl.put);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);



module.exports = router;