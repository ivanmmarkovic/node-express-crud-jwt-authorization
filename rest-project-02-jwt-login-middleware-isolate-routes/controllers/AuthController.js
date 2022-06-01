const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async (req, res, next) => {
    try {
        let {email, password} = req.body;
        let user = await UserModel.findOne({email});
        if(user == null){
            return res.status(404).json({message: `User with ${username} not found`});
        }
        let matches = await bcrypt.compare(password, user.password);
        if(!matches){
            return res.status(400).json({message: 'Invalid password'});
        }
        let token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
            algorithm: "HS256",
            expiresIn: global.jwtExpires
        });
        res.set('Authorization', `Bearer ${token}`);
        return res.status(204).json(null);
    } catch (error) {
        next(error);
    }
};


module.exports = {loginController};