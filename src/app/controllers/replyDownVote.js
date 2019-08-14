const Question = require('../models/question');

module.exports = {

    async store (request, response) {
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
    },

    async delete (request, response) {
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
    },

};