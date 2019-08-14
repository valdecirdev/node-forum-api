const express = require('express');

const ReplyController = require('../controllers/reply');
const ReplyUpVoteController = require('../controllers/replyUpVote');
const ReplyDownVoteController = require('../controllers/replyDownVote');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, ReplyController.index);
router.get('/:replyId', authMiddleware, ReplyController.show);
router.put('/:replyId', authMiddleware, ReplyController.update);
router.delete('/:replyId', authMiddleware, ReplyController.delete);

router.post('/:replyId/upvote', authMiddleware, ReplyUpVoteController.store);
router.delete('/:replyId/upvote', authMiddleware, ReplyUpVoteController.delete);

router.post('/:replyId/downvote', authMiddleware, ReplyDownVoteController.store);
router.delete('/:replyId/downvote', authMiddleware, ReplyDownVoteController.delete);

module.exports = app => app.use('/replies', router);