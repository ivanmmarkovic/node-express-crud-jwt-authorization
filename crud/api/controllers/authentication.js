const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require("jsonwebtoken");

const jwtKey = "SECRET";
const jwtExpirySeconds = 300;

const register = (req, res) => {
    const { username, email, password } = req.body
	if (!username || !email || !password) {
		res.status(400)
            .json({ "message": "All fields required" });
	}
    
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);

    user.save((err) => {
        if (err) {
            res
                .status(404)
                .json(err);
        } else {
            const token = jwt.sign({ username }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds
            });
            res.set('Authorization', 'Bearer ' + token);
            res
                .status(201)
                .end();
        }
    });
};
  

const login = (req, res) => {
    const { username, password } = req.body
	if (!username || !password) {
		res.status(400)
            .json({ "message": "All fields required" });
    }
    User.find({username})
        .exec((err, user) => {
            if(err){
                res.status(404).json(err);
            }
            else {
                if(!user){
                    res.status(404).json({"message": "user not found"});
                }
                else {
                    let model = new User();
                    console.log(user);
                    if(!model.verifyPassword(password, user[0].salt, user[0].hash)){
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

module.exports = {
    login,
    register
};