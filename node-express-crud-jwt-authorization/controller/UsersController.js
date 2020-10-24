const mongoose = require('mongoose');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = (req, res, next) => {
    let {username, password} = req.body;
    UserModel.findOne({username}, (err, user) => {
        if(err){
            next(err);
        }
        else{
            if(user){
                bcrypt.compare(password, user.password, (err, same) => {
                    if(same){
                        const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                            algorithm: "HS256",
                            expiresIn: global.jwtExpires
                        });
                        res.set("Authorization", "Bearer " + token);
                        res.status(200);
                        res.send(null);
                    }
                    else {
                        res.status(400);
                        res.send({message: "Incorrect password"});
                    }
                })
            }
            else{
                res.status(400);
                res.send({message: "Incorrect username/password"});
            }
        }
    });
};

const logout = (req, res, next) => {
    const token = jwt.sign({username: "", id: 0}, global.jwtKey, {
        algorithm: "HS256",
        expiresIn: 0
    });
    res.set("Authorization", "Bearer " + token);
    res.status(200);
    res.send(null);
};

const createUser = (req, res, next) => {
    UserModel.create({...req.body}, (err, user) => {
        if(err){
            next(err);
        }
        else {
            const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                algorithm: "HS256",
                expiresIn: global.jwtExpires
            });
            res.set("Authorization", "Bearer " + token);
            res.status(201);
            res.send(user);
        }
    });
};

const getUserById = (req, res, next) => {
    let bearer = req.header("Authorization");
    let token = bearer.split(" ")[1];
    let payload = jwt.verify(token, global.jwtKey);
    if(payload.id != req.params.id){
        res.status(403);
        return res.send({message: "Forbidden"});
    }
    let userId = req.params.id;
    UserModel.findById(userId, (err, user) => {
        if(err){
            next(err);
        }
        else{
            const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                algorithm: "HS256",
                expiresIn: global.jwtExpires
            });
            res.set("Authorization", "Bearer " + token);
            res.status(200);
            res.send(user);
        }
    });
};


const updateUser = (req, res, next) => {
    let bearer = req.header("Authorization");
    let token = bearer.split(" ")[1];
    let payload = jwt.verify(token, global.jwtKey);
    if(payload.id != req.params.id){
        res.status(403);
        return res.send({message: "Forbidden"});
    }
    let userId = req.params.id;
    let {username, password, email} = req.body;
    let userData = {};
    if(username){
        userData.username = username; 
    }
    if(email){
        userData.email = email;
    }
    if(password){
        userData.password = password;
        bcrypt.hash(userData.password, 3, (err, hash) => {
            userData.password = hash;
            if(err){
                next(err);
            }
            else {
                UserModel.findByIdAndUpdate(userId, {...userData}, {new: true},  (err, user) => {
                    if(err){
                        next(err);
                    }
                    else {
                        const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                            algorithm: "HS256",
                            expiresIn: global.jwtExpires
                        });
                        res.set("Authorization", "Bearer " + token);
                        res.status(200);
                        res.send(user);
                    }
                });
            }
        });
    }
    else {
        UserModel.findByIdAndUpdate(userId, {...userData}, {new: true},  (err, user) => {
            if(err){
                next(err);
            }
            else {
                const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                    algorithm: "HS256",
                    expiresIn: global.jwtExpires
                });
                res.set("Authorization", "Bearer " + token);
                res.status(200);
                res.send(user);
            }
        });
    }
};

const deleteUser = (req, res, next) => {
    let bearer = req.header("Authorization");
    let token = bearer.split(" ")[1];
    let payload = jwt.verify(token, global.jwtKey);
    if(payload.id != req.params.id){
        res.status(403);
        return res.send({message: "Forbidden"});
    }
    let userId = req.params.id;
    UserModel.findByIdAndDelete(userId, (err, user) => {
        if(err){
            next(err);
        }
        else{
            const token = jwt.sign({username: user.username, id: user._id}, global.jwtKey, {
                algorithm: "HS256",
                expiresIn: 0
            });
            res.set("Authorization", "Bearer " + token);
            res.status(200);
            res.send(null);
        }
    });
};

module.exports = {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout
};