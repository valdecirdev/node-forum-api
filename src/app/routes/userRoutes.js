const express = require('express');

const UserController = require('../controllers/user');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, UserController.index);
router.get('/:userId', authMiddleware, UserController.show);
router.put('/:userId', authMiddleware, UserController.update);

module.exports = app => app.use('/users', router);