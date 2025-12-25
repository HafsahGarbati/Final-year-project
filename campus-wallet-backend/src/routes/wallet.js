const express = require('express');
const { getBalance, loadFunds, getWalletSummary } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const { loadFundsRules, validate } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/balance', getBalance);
router.post('/load', loadFundsRules, validate, loadFunds);
router.get('/summary', getWalletSummary);

module.exports = router;
