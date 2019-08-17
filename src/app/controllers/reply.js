const Answer = require('../models/answer');
const Reply = require('../models/reply');
const User = require('../models/user');

module.exports = {

    async index (request, response) {
        try {
            const { limit = 10, page = 1 } = request.query;
            const replies = await Reply.paginate({}, { populate: [
                { path: 'user', model: User },
                { path: 'answer', model: Answer },
                { path: 'upVotes', model: User },
                { path: 'downVotes', model: User },
            ], page, limit: parseInt(limit)});
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: replies });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading replies', data: null });
        }
    },

    async show (request, response) {
        const { replyId } = request.params;
        try {
            const reply = await Reply.findById( replyId ).populate([
                { path: 'user', model: User },
                { path: 'answer', model: Answer },
                { path: 'upVotes', model: User },
                { path: 'downVotes', model: User },
            ]);
    
            return response.status(200).send({ success: true, message: 'Service performed successfully', data: reply });
        } catch (err) {
            return response.status(500).send({ success: false, message: 'Error loading reply', data: null });
        }
    },

    async store (request, response) {
        const { answerId } = request.params;
        try {
            if(!request.auth)
                return response.status(401).send({ success: false, message: 'Failed on authenticate', data: null });
        
            const { description } = request.body;

            const reply = await Reply.create({ description, answer: answerId, user: request.userId });
            
            const answerReply = await Answer.findById( answerId );
            answerReply.replies.push( reply );
            await answerReply.save();

            return response.status(201).send({ success: true, message: 'Service performed successfully', data: reply });
        } catch (err) {
            console.log(err);
            return response.status(500).send({ success: false, message: 'Creation failed', data: null });
        }
    },

    async update (request, response) {
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
    },

    async delete (request, response) {
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
    },

};
