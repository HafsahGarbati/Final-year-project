const express = require('express');
const { register, login, getMe, changePin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules, validate } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-pin', protect, changePin);

module.exports = router;
