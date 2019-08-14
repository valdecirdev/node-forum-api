const Question = require('../models/question');

module.exports = {

    async store (request, response) {
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
    },

    async delete (request, response) {
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
    },

};