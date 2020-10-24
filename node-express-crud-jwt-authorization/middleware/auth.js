const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    let bearer = req.header("Authorization");
    if(!bearer){
        res.status(401);
        res.send({message: "Unauthorized"});
    }
    else {
        let payload;
        try {
            let token = bearer.split(" ")[1];
            payload = jwt.verify(token, global.jwtKey);
            next();
        }
        catch(e){
            if(e instanceof jwt.JsonWebTokenError){
                res.status(401);
                return res.send({message: "Unauthorized"});
            }
            else{
                res.status(400);
                return res.send({message: "bad Request"});
            }
        }
        
    } 

}

module.exports = jwtAuth;