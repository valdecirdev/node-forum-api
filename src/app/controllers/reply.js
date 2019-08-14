const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Reply = require('../models/reply');
const Answer = require('../models/answer');

const router = express.Router();

router.get('/', authMiddleware, async (request, response) => {
    try {
        const { limit = 10, page = 1 } = request.query;
        const replies = await Reply.paginate({}, { populate: ['user', 'answer', 'upVotes', 'downVotes'], page, limit: parseInt(limit)});

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: replies });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading replies', data: null });
    }
});

router.get('/:replyId', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        const reply = await Reply.findById( replyId ).populate(['user', 'answer', 'upVotes', 'downVotes']);

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: reply });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading reply', data: null });
    }
});

router.post('/', authMiddleware, async (request, response) => {
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
    
        const { description, answer } = request.body;

        const reply = await Reply.create({ description, answer: answer, user: request.userId });
        
        const replyAnswer = await Answer.findById( answer );
        replyAnswer.replies.push( reply );
        await replyAnswer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: reply });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Creation failed', data: null });
    }
});

router.put('/:replyId', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    const { description } = request.body;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        if(reply.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        reply.description = description;
        reply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: reply });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error on update', data: null });
    }
});

router.delete('/:replyId', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        if(reply.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        reply.delete();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error deleting reply', data: null });
    }
});

router.post('/:replyId/upvote', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        if(reply.downVotes.includes( request.userId )){
            reply.downVotes.pop( request.userId );
            await reply.save();
        }

        reply.upVotes.push( request.userId );
        await reply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting reply', data: null });
    }
});

router.delete('/:replyId/upvote', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        reply.upVotes.pop( request.userId );
        await reply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting reply', data: null });
    }
});

router.post('/:replyId/downvote', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        if(reply.upVotes.includes( request.userId )){
            reply.upVotes.pop( request.userId );
            await reply.save();
        }

        reply.downVotes.push( request.userId );
        await reply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting reply', data: null });
    }
});

router.delete('/:replyId/downvote', authMiddleware, async (request, response) => {
    const { replyId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const reply = await Reply.findById( replyId );
        
        if(!reply)
            return response.status(400).send({ success: false, message: 'Reply not exists', data: null });
        
        reply.downVotes.pop( request.userId );
        await reply.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting reply', data: null });
    }
});

module.exports = app => app.use('/replies', router);
