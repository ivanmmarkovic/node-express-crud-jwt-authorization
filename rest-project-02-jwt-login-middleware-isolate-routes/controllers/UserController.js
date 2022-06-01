
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        password = await bcrypt.hash(password, 10);
        let createdAt = new Date();
        let updatedAt = createdAt;
        let user = await UserModel.create({username, password, email, createdAt, updatedAt});
        let token = jwt.sign({username, id: user._id}, global.jwtKey, {
            algorithm: "HS256",
            expiresIn: global.jwtExpires
        });
        res.set('Authorization', `Bearer ${token}`);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        let users = await UserModel.find();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        let {id} = req.params;
        let user = await UserModel.findById(id);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


const patchUserById = async (req, res, next) => {
    try {
        let {payload} = req;
        let {id} = req.params;
        console.log(payload);
        console.log(id);
        if(payload.id != id){
            return res.status(403).json({message: 'Forbidden'});
        }
        if(req.body.password != undefined){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        console.log(req.body.password);
        let user = await UserModel.findByIdAndUpdate(id, {...req.body, updatedAt: new Date()}, {new: true});
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        let {payload} = req;
        let {id} = req.params;
        if(payload.id != id){
            return res.status(403).json({message: 'Forbidden'});
        }
        let user = await UserModel.findByIdAndDelete(id);
        return res.status(204).json(null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    patchUserById,
    deleteUserById
};