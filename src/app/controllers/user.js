const User = require('../models/user');

module.exports = {

    async index (request, response) {
        try {
            const users = await User.find();
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: users });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading users', data: null });
        }
    },

    async show (request, response) {
        const { userId } = request.params;
        try {
            const user = await User.findById( userId );
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: user });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading user', data: null });
        }
    },

    async update (request, response) {
        const { userId } = request.params;
        try {
            if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
            
            let user = await User.findById( userId );
    
            if(!user)
                return response.status(400).send({ success: false, message: 'User not exists', data: null });
    
            if(user._id.toString() !== request.userId)
                return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
            
            user = await User.findByIdAndUpdate(user._id, request.body, { new: true });
    
            user.password = undefined;
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: user });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error on update', data: null });
        }
    },

};
