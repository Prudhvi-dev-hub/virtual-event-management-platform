const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const Boom = require('@hapi/boom');

const participantAuthGuard = (req,res,next)=>{    
    const reqHeaders = req.headers['authorization'];
    const token = reqHeaders ? reqHeaders.split(" ")[1]:null;    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || !decoded.role || decoded.role !== 'participant'){
            throw Boom.unauthorized("You are not authorized to access this resource");
        }
        req.authUser = decoded;
    } catch (error) {
        return res.status(401).send({status: 401,error: error.message});
    }
    next();
}

module.exports = participantAuthGuard;