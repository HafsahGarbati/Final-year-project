const express = require('express');
const {
    getAllUsers,
    getUser,
    updateUserStatus,
    addFundsToUser,
    getAllTransactions,
    getSystemStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', updateUserStatus);
router.post('/users/:id/add-funds', addFundsToUser);

// Transactions
router.get('/transactions', getAllTransactions);

// Statistics
router.get('/stats', getSystemStats);

module.exports = router;
