const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/AuthMiddleware');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');

mongoose.connect('mongodb://admin:password@localhost:27017/articles?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

global.jwtKey = "secret";
global.jwtExpires = 24 * 60 * 60 * 1000;

app.use('', userRoutes);
app.use('', authRoutes);

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