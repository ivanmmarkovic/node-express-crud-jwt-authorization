
const jwt = require('jsonwebtoken');

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


module.exports = authMiddleware;