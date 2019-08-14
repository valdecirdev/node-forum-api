const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Answer = require('../models/answer');
const Reply = require('../models/reply');

const router = express.Router();

router.get('/', authMiddleware, async (request, response) => {
    try {
        const { limit = 10, page = 1 } = request.query;
        const answers = await Answer.paginate({}, { populate: ['user', 'question', 'replies', 'upVotes', 'downVotes'], page, limit: parseInt(limit)});

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: answers });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading answers', data: null });
    }
});

router.get('/:answerId', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        const answer = await Answer.findById( answerId ).populate(['user', 'replies', 'question', 'upVotes', 'downVotes']);

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: answer });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading answer', data: null });
    }
});

router.post('/:answerId/reply', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
    
        const { description } = request.body;

        const reply = await Reply.create({ description, answer: answerId, user: request.userId });
        
        const answerReply = await Answer.findById( answerId );
        answerReply.replies.push( reply );
        await answerReply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: reply });
    } catch (err) {
        console.log(err);
        return response.status(500).send({ success: false, message: 'Creation failed', data: null });
    }
});

router.put('/:answerId', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    const { description } = request.body;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        if(answer.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        answer.description = description;
        answer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: answer });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error on update', data: null });
    }
});

router.delete('/:answerId', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        if(answer.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        answer.delete();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error deleting answer', data: null });
    }
});

router.post('/:answerId/upvote', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        if(answer.downVotes.includes( request.userId )){
            answer.downVotes.pop( request.userId );
            await answer.save();
        }

        answer.upVotes.push( request.userId );
        await answer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting answer', data: null });
    }
});

router.delete('/:answerId/upvote', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        answer.upVotes.pop( request.userId );
        await answer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting answer', data: null });
    }
});

router.post('/:answerId/downvote', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        if(answer.upVotes.includes( request.userId )){
            answer.upVotes.pop( request.userId );
            await answer.save();
        }

        answer.downVotes.push( request.userId );
        await answer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting answer', data: null });
    }
});

router.delete('/:answerId/downvote', authMiddleware, async (request, response) => {
    const { answerId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const answer = await Answer.findById( answerId );
        
        if(!answer)
            return response.status(400).send({ success: false, message: 'Answer not exists', data: null });
        
        answer.downVotes.pop( request.userId );
        await answer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting answer', data: null });
    }
});

module.exports = app => app.use('/answers', router);
