const Answer = require('../models/answer');
const Question = require('../models/question');
const Reply = require('../models/reply');
const User = require('../models/user');

module.exports = {

    async index (request, response) {
        try {
            const { limit = 10, page = 1 } = request.query;
            const answers = await Answer.paginate({}, {
                populate: [
                    { path: 'user', model: User },
                    { path: 'question', model: Question },
                    { path: 'replies', model: Reply },
                    { path: 'upVotes', model: User },
                    { path: 'downVotes', model: User }
                ], page, limit: parseInt(limit)});

            return response.status(200).send({ success: true, message: 'Service performed successfully', data: answers });
        } catch (err) {
            console.log(err);
            return response.status(500).send({ success: false, message: 'Error loading answers', data: null });
        }
    },

    async show (request, response) {
        const { answerId } = request.params;
        try {
            const answer = await Answer.findById( answerId ).populate([
                { path: 'user', model: User },
                { path: 'question', model: Question },
                { path: 'replies', model: Reply },
                { path: 'upVotes', model: User },
                { path: 'downVotes', model: User }
            ]);

            return response.status(200).send({ success: true, message: 'Service performed successfully', data: answer });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading answer', data: null });
        }
    },

    async store (request, response) {
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
    },

    async update (request, response) {
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
    },

    async delete (request, response) {
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
    },

};
