const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jwt-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

global.jwtKey = "secret";
global.jwtExpires = 24 * 60 * 60 * 1000;

const bodyParser = require('body-parser');
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

const apiRouter = require('./routes/apiRouter');

app.use("/api", apiRouter);


app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send({
        message: err.message
    })
});

const port = process.env.PORT || 3000;
app.listen(port);