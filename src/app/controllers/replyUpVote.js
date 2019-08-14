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
    },

    async delete (request, response) {
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
    },

};