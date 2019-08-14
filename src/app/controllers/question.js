const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Question = require('../models/question');
const Answer = require('../models/answer');

const router = express.Router();

router.get('/', authMiddleware, async (request, response) => {
    try {
        const { limit = 10, page = 1 } = request.query;
        const questions = await Question.paginate({}, { populate: ['user', 'answers', 'upVotes', 'downVotes'], page, limit: parseInt(limit) });//.populate(['user', 'answers']);
        
        return response.status(200).send({ success: true, message: 'Service performed successfully', data: questions });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading questions', data: null });
    }
});

router.get('/:questionId', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        const question = await Question.findById( questionId ).populate(['user', 'answers', 'upVotes', 'downVotes']);
        
        //     totalAnswers: Object.keys(question.answers).length,
        return response.status(200).send({ success: true, message: 'Service performed successfully', data: question });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error loading question', data: null });
    }
});

router.post('/', authMiddleware, async (request, response) => {
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });

        const question = await Question.create({ ...request.body, user: request.userId });

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: question });
    } catch(err){
        return response.status(500).send({ success: false, message: 'Creation failed', data: null });
    }
});

router.put('/:questionId', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });

        let question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        if(question.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        question.title = request.body.title;
        question.description = request.body.description;
        question.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: question });
    } catch (err) {
        console.log(err);
        return response.status(500).send({ success: false, message: 'Error on update', data: null });
    }
});

router.delete('/:questionId', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        if(question.user.toString() !== request.userId)
            return response.status(401).send({ success: false, message: 'User no authentication required', data: null });
        
        question.delete();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error deleting question', data: null });
    }
});

router.post('/:questionId/answer', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
    
        const { description } = request.body;

        const answer = await Answer.create({ description, question: questionId, user: request.userId });
        
        const questionAnswer = await Question.findById(questionId);
        questionAnswer.answers.push(answer);
        await questionAnswer.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: answer });
    } catch (err) {
        console.log(err);
        return response.status(500).send({ success: false, message: 'Creation failed', data: null });
    }
});

router.post('/:questionId/upvote', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        
        if(question.downVotes.includes( request.userId )){
            question.downVotes.pop( request.userId );
            await question.save();
        }

        question.upVotes.push( request.userId );
        await question.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting question', data: null });
    }
});

router.delete('/:questionId/upvote', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        
        question.upVotes.pop( request.userId );
        await question.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error upvoting question', data: null });
    }
});

router.post('/:questionId/downvote', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        
        if(question.upVotes.includes( request.userId )){
            question.upVotes.pop( request.userId );
            await question.save();
        }

        question.downVotes.push( request.userId );
        await question.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting question', data: null });
    }
});

router.delete('/:questionId/downvote', authMiddleware, async (request, response) => {
    const { questionId } = request.params;
    try {
        if(!request.auth)
            return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
        const question = await Question.findById( questionId );
        
        if(!question)
            return response.status(400).send({ success: false, message: 'Question not exists', data: null });
        
        question.downVotes.pop( request.userId );
        await question.save();

        return response.status(200).send({ success: true, message: 'Service performed successfully', data: null });
    } catch (err) {
        return response.status(500).send({ success: false, message: 'Error downvoting question', data: null });
    }
});

module.exports = app => app.use('/questions', router);
