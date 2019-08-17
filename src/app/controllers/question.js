const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');

module.exports = {

    async index (request, response) {
        try {
            const { limit = 10, page = 1 } = request.query;
            const questions = await Question.paginate({}, { populate: [
                { path: 'user', model: User},
                { path: 'answers', model: Answer },
                { path: 'upVotes', model: User },
                { path: 'downVotes', model: User },
            ], page, limit: parseInt(limit) });
            
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: questions });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading questions', data: null });
        }
    },

    async show (request, response) {
        const { questionId } = request.params;
        try {
            const question = await Question.findById( questionId ).populate([
                { path: 'user', model: User},
                { path: 'answers', model: Answer },
                { path: 'upVotes', model: User },
                { path: 'downVotes', model: User },
            ]);
            
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: question });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading question', data: null });
        }
    },

    async store (request, response) {
        try {
            if(!request.auth)
                return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
    
            const question = await Question.create({ ...request.body, user: request.userId });
    
            return response.status(201).send({ success: true, message: 'Service performed successfully', data: question });
        } catch(err){
            return response.status(500).send({ success: false, message: 'Creation failed', data: null });
        }
    },

    async update (request, response) {
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
            return response.status(500).send({ success: false, message: 'Error on update', data: null });
        }
    },

    async delete (request, response) {
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
    },

};
