const express = require('express');
const { processPayment, getSales, getStats } = require('../controllers/merchantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and merchant role
router.use(protect);
router.use(authorize('merchant'));

router.post('/process-payment', processPayment);
router.get('/sales', getSales);
router.get('/stats', getStats);

module.exports = router;
