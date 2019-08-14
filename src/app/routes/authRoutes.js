const express = require('express');

const AuthController = require('../controllers/auth');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authMiddleware, AuthController.register);
router.post('/confirm', authMiddleware, AuthController.confirm);
router.post('/authenticate', authMiddleware, AuthController.authenticate);

router.post('/forgot_password', authMiddleware, AuthController.forgot_password);

router.post('/reset_password', authMiddleware, AuthController.reset_password);

router.post('/logout', authMiddleware, AuthController.logout);

router.get('/history', authMiddleware, AuthController.history);
router.post('/logout_token', authMiddleware, AuthController.logout_token);

module.exports = app => app.use('/auth', router);