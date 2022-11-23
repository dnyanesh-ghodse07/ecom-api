const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;

    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err,user) => {
            if(err) res.status(403).json('token is invalid');
            req.user = user;
            next();
        })
    }else{
        res.status(401).json('You dont have enough permissions');
    }
}


const verifyTokenAndAuthrization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json('You dont have enough permissions');
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json('You dont have enough permissions');
        }
    });
}

module.exports = {verifyToken, verifyTokenAndAuthrization, verifyTokenAndAdmin};