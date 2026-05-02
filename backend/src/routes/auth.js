const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/password-reset/request', authController.requestPasswordReset);
router.post('/password-reset/confirm', authController.confirmPasswordReset);

module.exports = router;
