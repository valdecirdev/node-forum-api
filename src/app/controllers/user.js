const express = require('express');
const authMiddleware = require('../middlewares/auth');

const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Reply = require('../models/reply');

const router = express.Router();

router.get('/', authMiddleware, async (request, response) => {
    try {
        const users = await User.find();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: users });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading users', data: null });
    }
})

router.get('/:userId', authMiddleware, async (request, response) => {
    const { userId } = request.params;
    try {
        const user = await User.findById( userId );

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: user });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading user', data: null });
    }
});

router.get('/:userId/questions', authMiddleware, async (request, response) => {
    const { userId } = request.params;
    try {
        const questions = await Question.find({ user: userId }).populate(['user', 'answers']);

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: questions });
    } catch (err) {
        return response.status(500).send({ success: false, message: "Error loading user's questions", data: null});
    }
});

router.get('/:userId/answers', authMiddleware, async (request, response) => {
    const { userId } = request.params;
    try {
        const answers = await Answer.find({ user: userId }).populate(['user']);

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: answers });
    } catch (err) {
        return response.status(500).send({ success: false, message: "Error loading user's answers", data: null });
    }
});

router.get('/:userId/replies', authMiddleware, async (request, response) => {
    const { userId } = request.params;
    try {
        const replies = await Reply.find({ user: userId }).populate(['user']);

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: replies });
    } catch (err) {
        return response.status(500).send({ success: false, message: "Error loading user's replies", data: null });
    }
});

router.put('/:userId', authMiddleware, async (request, response) => {
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
});

module.exports = app => app.use('/users', router);
