const jwt = require('jsonwebtoken');

const AuthHistory = require('../models/authHistory');

module.exports = (request, response, next) => {
    const authHeader = request.headers.authorization;

    request.auth = false;
    if(!authHeader){
        return next();
    }

    if (!authHeader)
        return response.status(401).json({ error: 'No token provided' });
    
    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return response.status(401).json({ error: 'Token error' });

    const [ scheme, token ] = parts;


    if(!/^Bearer$/i.test(scheme))
        return response.status(401).json({ error: 'Token malformatted' });

    jwt.verify(token, process.env.APP_SECRET, async (err, decoded) => {
        if(err)
            return response.status(401).json({ error: 'Token Invalid' });
        
        const history = await AuthHistory.findOne({ token: token, $and: [{ status: true }] });

        if(!history)
            return response.status(401).json({ error: 'Token not registered' });

        request.userId = decoded.id;
        request.token = token;
        request.auth = true;
        return next();
    });
};
