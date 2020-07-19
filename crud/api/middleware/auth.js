

const jwtAuth = (req, res, next) => {
    let bearer = req.header('Authorization');
    if(!bearer){
        res.status(401).json({ "message": "not allowed" });
    }
    next();
};


module.exports = {
    jwtAuth
};