const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const User = require('../models/user');
const AuthHistory = require('../models/authHistory');

function generateToken( params = {} ) {
    return jwt.sign(params, process.env.APP_SECRET, {
        expiresIn : 86400,
    });
};

async function registerAuthHistory( params = {} ) {
    const { token, user } = params;

    if (!token || !user)
        return false;
    
    await AuthHistory.create({ token, user });

    return true;
};

module.exports = {

    async register (request, response) {
        const { email, username } = request.body;
        try {
            let user = await User.findOne({ $or: [{ email }, { username }] });
            if(user) {
                if( user.email === email )
                    return response.status(400).send({ success: false, message: 'Email already exists', data: null });
                
                if( user.username === username )
                    return response.status(400).send({ success: false, message: 'Username already exists', data: null });
            }
    
            const confirmToken = crypto.randomBytes(20).toString('hex');
    
            user = await User.create({ ...request.body, confirmToken });
    
            // Envia email de boas vindas ao novo usuário
            mailer.sendMail({
                to: email,
                from: 'valdecir.junior@outlook.com',
                template: 'auth/register',
                context: { confirmToken },
            }, (err) => {
                if (err)
                    return response.status(500).send({ success: false, message: 'Cannot send forgot passwrod email', data: null });
                
                return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
            });
    
            // Remove atributos do JSON de retorno
            user.password = undefined;
            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
    
            const token = generateToken({ id: user.id });
    
            await registerAuthHistory({ token, user: user._id });
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: { user, token } });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Registration failed', data: null });
        }
    },

    async confirm (request, response) {
        const { token, password } = request.body;
        try {
            const user = await User.findOne({ confirmToken: token });
            
            if(!user)
                return response.status(400).send({ success: false, message: 'User not found or token invalid', data: null });
            
            user.confirmed = true;
            user.confirmToken = null;
            user.password = password;
            await user.save();
            
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Cannot reset password, try again', data: null });
        }
    },

    async authenticate (request, response) {
        const { email, password } = request.body;
        try{ 
            const user = await User.findOne({ email }).select('+password');
    
            if (!user)
                return response.status(400).send({ success: true, message: 'User not found', data: null });
            
            if (!await bcrypt.compare( password, user.password))
                return response.status(400).send({ success: true, message: 'Invalid password', data: null });
    
            user.password = undefined;
            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
    
            const token = generateToken({ id: user.id });
            await registerAuthHistory({ token, user: user.id });
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: { user, token } });
        } catch (err) {
            console.log(err);
            return response.status(500).send({ success: false, message: 'Authenticate failed', data: null });
        }
    },

    async forgot_password (request, response) {
        const { email } = request.body;
        try {
            const user = await User.findOne({ email });
    
            if(!user)
                return response.status(400).send({ success: false, message: 'User not found', data: null });
            
            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);
    
            user.passwordResetToken = token;
            user.passwordResetExpires = now;
            await user.save();
            
            mailer.sendMail({
                to: email,
                from: 'valdecir.junior@outlook.com',
                template: 'auth/forgot_password',
                context: { token },
            }, (err) => {
                if (err)
                    return response.status(500).send({ success: false, message: 'Cannot send forgot passwrod email', data: null });
                
                return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
            });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error on forgot password, try again', data: null });
        }
    },

    async reset_password (request, response) {
        const { email, token, password } = request.body;
        try {
            const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
            
            if(!user)
                return response.status(400).send({ success: false, message: 'User not found', data: null });
            
            if(token !== user.passwordResetToken)
                return response.status(401).send({ success: false, message: 'Token Invalid', data: null });
            
            const now = new Date();
            if(now > user.passwordResetExpires)
                return response.status(401).send({ success: false, message: 'Token expired, generate a new one', data: null });
                
            user.password = password;
            await user.save();
            
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Cannot reset password, try again', data: null });
        }
    },

    async logout (request, response) {
        try {
            if(!request.auth)
                return response.status(401).send({ success: false, message: 'Unauthenticated user', data: null });
            
            let history = await AuthHistory.findOne({ token: request.token, user: request.userId });
    
            if(!history)
                return response.status(400).send({ success: false, message: 'Token not registered', data: null });
            
            history = await AuthHistory.findByIdAndUpdate( history._id, { status: false }, { new: true } );
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: history });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Logout error', data: null });
        }
    },

    async history (request, response) {
        try {
            const history = await AuthHistory.find({ user: request.userId });
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: history });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Failed to query history', data: null });
        }
    },

    async logout_token (request, response) {
        const { token } = request.body;
        try {
            if(!request.auth)
                return response.status(401).send({ success: false, message: 'Unauthenticated user', data: null });
            
            let history = await AuthHistory.findOne({ token, user: request.userId });
    
            if(!history)
                return response.status(400).send({ success: false, message: 'Token not registered', data: null });
            
            history = await AuthHistory.findByIdAndUpdate( history._id, { status: false }, { new: true } );
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: history });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Logout error', data: null });
        }
    },

};
