const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require("jsonwebtoken");

const jwtKey = "SECRET";
const jwtExpirySeconds = 300;

const getAll = (req, res) => {
    User.find()
        .exec((err, users) => {
            if(err){
                res.status(400).json(err)
            }
            else{
                res.status(200).json(users)
            }
    });
};


const getOne = (req, res) => {
    const { username } = req.params;
    User.find({ username })
        .exec((err, user) => {
            if (err) {
                res.status(404).json(err);
            }
            else {
                if (!user) {
                    res.status(404).json({ "message": "user not found" });
                }
                else {
                    res.status(200).json(user)
                }
            }
        });
};

const put = (req, res) => {
    const { username } = req.params;
    console.log(username);
    User.find({ username })
        .exec((err, user) => {
            if (err) {
                res.status(404).json(err);
            }
            else {
                if (!user || user.length == 0) {
                    res.status(404).json({ "message": "user not found" });
                }
                else {
                    user = user[0];
                    let bearer = req.header('Authorization');
                    if(!bearer){
                        res.status(401).json({ "message": "not allowed" });
                    }
                    let token = bearer.split(" ")[1];
                    let payload = jwt.verify(token, jwtKey);
                    console.log("payload.username", payload.username, "user.username : ", user.username);
                    if(payload.username != user.username){
                        res.status(401).json({ "message": "not allowed" });
                    }
                    else{
                        let {username: usrnme, email, password} = req.body;
                        if(usrnme)
                            user.username = usrnme;
                        if(email)
                            user.email = email;
                        if(password){
                            let model = new User();
                            user.password = model.updatePassword(password, user.salt);
                        }
                        user.save((err, user) => {
                            if(err)
                                res.status(400).json(err);
                            else
                                res.status(200).json(user)
                        })
                    }
                }
            }
        });
}

module.exports = {
    getAll,
    getOne,
    put
}