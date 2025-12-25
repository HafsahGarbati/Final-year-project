const express = require('express');
const {
    sendMoney,
    getTransactionHistory,
    getTransaction,
    getRecentTransactions
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { sendMoneyRules, validate } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/send', sendMoneyRules, validate, sendMoney);
router.get('/history', getTransactionHistory);
router.get('/recent', getRecentTransactions);
router.get('/:id', getTransaction);

module.exports = router;
