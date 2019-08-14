const express = require('express');

const ReplyController = require('../controllers/reply');
const AnswerController = require('../controllers/answer');
const AnswerUpVoteController = require('../controllers/answerUpVote');
const AnswerDownVoteController = require('../controllers/answerDownVote');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, AnswerController.index);
router.get('/:answerId', authMiddleware, AnswerController.show);
router.put('/:answerId', authMiddleware, AnswerController.update);
router.delete('/:answerId', authMiddleware, AnswerController.delete);

router.post('/:answerId/reply', authMiddleware, ReplyController.store);

router.post('/:answerId/upvote', authMiddleware, AnswerUpVoteController.store);
router.delete('/:answerId/upvote', authMiddleware, AnswerUpVoteController.delete);

router.post('/:answerId/downvote', authMiddleware, AnswerDownVoteController.store);
router.delete('/:answerId/downvote', authMiddleware, AnswerDownVoteController.delete);

module.exports = app => app.use('/answers', router);