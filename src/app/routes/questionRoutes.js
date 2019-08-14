const express = require('express');

const AnswerController = require('../controllers/answer');
const QuestionController = require('../controllers/question');
const QuestionUpVoteController = require('../controllers/answerUpVote');
const QuestionDownVoteController = require('../controllers/answerDownVote');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, QuestionController.index);
router.post('/', authMiddleware, QuestionController.store);
router.get('/:questionId', authMiddleware, QuestionController.show);
router.put('/:questionId', authMiddleware, QuestionController.update);
router.delete('/:questionId', authMiddleware, QuestionController.delete);

router.post('/:questionId/answer', authMiddleware, AnswerController.store);

router.post('/:questionId/upvote', authMiddleware, QuestionUpVoteController.store);
router.delete('/:questionId/upvote', authMiddleware, QuestionUpVoteController.delete);

router.post('/:questionId/downvote', authMiddleware, QuestionDownVoteController.store);
router.delete('/:questionId/downvote', authMiddleware, QuestionDownVoteController.delete);

module.exports = app => app.use('/questions', router);