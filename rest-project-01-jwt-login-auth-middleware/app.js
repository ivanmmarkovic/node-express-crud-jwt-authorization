const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://admin:password@localhost:27017/articles?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

global.jwtKey = "secret";
global.jwtExpires = 24 * 60 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
    let bearer = req.header('Authorization');
    if(!bearer){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        let [, token] = bearer.split(' ');
        let payload = jwt.verify(token, global.jwtKey);
        req.payload = payload;
        next();
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({message: 'Unauthorized'});
        }
        else{
            return res.status(400).json({message: 'Bad request'});
        }
    }
};

app.post('/login', async (req, res, next) => {
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
});

app.post('/users', async (req, res, next) => {
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
});


app.get('/users', async (req, res, next) => {
    try {
        let users = await UserModel.find();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

app.get('/users/:id', async (req, res, next) => {
    try {
        let {id} = req.params;
        let user = await UserModel.findById(id);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});


app.patch('/users/:id', authMiddleware, async (req, res, next) => {
    try {
        let {payload} = req;
        let {id} = req.params;
        if(payload.id != id){
            return res.status(403).json({message: 'Forbidden'});
        }
        if(req.body.password != undefined){
            return req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        let user = await UserModel.findByIdAndUpdate(id, {...req.body, updatedAt: new Date()}, {new: true});
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

app.delete('/users/:id', authMiddleware, async (req, res, next) => {
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
});


app.get("/public", async (req, res, next) => {
    return res.status(200).json({message: "Public page"});
});

app.get("/protected", authMiddleware, async (req, res, next) => {
    // payload is set on req object in authMiddleware
    console.log(req.payload);
    return res.status(200).json({message: "Protected page"});
});


app.use((err, req, res, next) => {
    let error = {};
    error.status = err.status || 500;
    error.message = err.message || 'Internal server error';
    return res.json(error);
});


app.listen(5000);