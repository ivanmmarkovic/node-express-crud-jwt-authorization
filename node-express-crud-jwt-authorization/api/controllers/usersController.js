const mongoose = require('mongoose');
const { json } = require('express');
const User = mongoose.model('User');
const jwt = require("jsonwebtoken");
const { PayloadTooLarge } = require('http-errors');

const jwtKey = "SECRET";
const jwtExpirySeconds = 5 * 60 * 1000;

const login = (req, res) => {
    const { username, password } = req.body
	if (!username || !password) {
		res.status(400)
            .json({ "message": "All fields required" });
    }
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(404).json(err);
        }
        else {
            if(!user){
                res.status(404).json({"message": "user not found"});
            }
            else {
                if(!user.verifyPassword(password)){
                    res.status(404).json({"message": "wrong password"});
                }
                else{
                    const token = jwt.sign({ username }, jwtKey, {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds
                    });
                    res.set('Authorization', 'Bearer ' + token);
                        res
                            .status(200)
                            .end();
                }
            }
        }
    });
};

const create = (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password)
        res.status(400)
            .json({"message": "All fields required"});
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    user.save((err, user) => {
        if(err)
            res.status(400)
                .json({"message": err.message});
        else{
            const token = jwt.sign({ username }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds
            });
            res.set('Authorization', 'Bearer ' + token);
            res.status(201)
                .json(user);
        }
    });
};

const findAll = (req, res) => {
    User.find()
        .exec((err, users) => {
            if(err)
                res.status(400)
                    .json({"message": err.message});
            else
                res.status(200)
                    .json(users);
        });
};

const findById = (req, res) => {
    let {id} = req.params;
    User.findById(id, (err, user) => {
        if(err)
            res.status(400)
                .json({"message": err.message});
        else
            res.status(200)
                .json(user);
    });
};

const patchById = (req, res) => {
    let {id} = req.params;
    let {username, password, email} = req.body;
    User.findById(id, (err, user) => {
        if(err)
            res.status(400)
                .json({"message": err.message});
        else{
            if(username)
                user.username = username;
            if(email)
                user.email = email;
            if(password)
                user.updatePassword(password);
            user.save((err, user) => {
                if(err)
                    res.status(400).json(err);
                else{
                    // if username is updated too
                    if(username){
                        const token = jwt.sign({ username }, jwtKey, {
                            algorithm: "HS256",
                            expiresIn: jwtExpirySeconds
                        });
                        res.set('Authorization', 'Bearer ' + token);
                        res.status(200)
                            .json(user);
                    }
                    else{
                        const token = jwt.sign({ username }, jwtKey, {
                            algorithm: "HS256",
                            expiresIn: jwtExpirySeconds
                        });
                        res.set('Authorization', 'Bearer ' + token);
                        res.status(200)
                            .json(user);
                    }
                }
            });
        }
    });
};

const deletebyId = (req, res) => {
    let {id} = req.params;
    User.findById(id, (err, user) => {
        if(err)
            res.status(400)
                .json({"message": err.message});
        else {
            let bearer = req.header('Authorization');
            let payload;
            try {
                let token = bearer.split(" ")[1];
                payload = jwt.verify(token, jwtKey);
                if(user.username != payload.username)
                    res.status(401).json({ "message": "not allowed" });
                else{
                    User.deleteOne({_id: id}, err => {
                        if(err)
                            res.status(400).send({"message": err.message});    
                        else
                            res.status(200).send(null);
                    });
                }
            } catch (error) {
                if (e instanceof jwt.JsonWebTokenError) {
                    return res.status(401).end();
                }
                else{
                    return res.status(400).end();
                }
            }
        }
    });
    
}; 

module.exports = {
    create,
    findAll,
    findById,
    patchById,
    deletebyId,
    login
};