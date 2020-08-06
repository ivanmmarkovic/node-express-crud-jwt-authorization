const jwt = require("jsonwebtoken");

const jwtKey = "SECRET";
const jwtExpirySeconds = 5 * 60 * 1000;

const jwtAuth = (req, res, next) => {
    let bearer = req.header('Authorization');
    if(!bearer){
        res.status(401).json({ "message": "not allowed" });
    }
    else {
        let payload;
        try {
            let token = bearer.split(" ")[1];
            payload = jwt.verify(token, jwtKey);
            console.log(payload.username);
            next();
        } catch (error) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end();
            }
            else{
                return res.status(400).end();
            }
        }
    }
};


module.exports = {
    jwtAuth
};