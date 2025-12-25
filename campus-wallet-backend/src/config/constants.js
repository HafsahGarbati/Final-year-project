module.exports = {
    // Transaction limits
    MIN_TRANSACTION_AMOUNT: 10,
    MAX_TRANSACTION_AMOUNT: 50000,
    DEFAULT_DAILY_LIMIT: 50000,

    // Fees
    FREE_DAILY_TRANSACTIONS: 5,
    TRANSACTION_FEE: 5,

    // System
    SYSTEM_USER_ID: 'SYSTEM',

    // Roles
    ROLES: {
        STUDENT: 'student',
        MERCHANT: 'merchant',
        ADMIN: 'admin'
    },

    // Status
    STATUS: {
        ACTIVE: 'active',
        SUSPENDED: 'suspended',
        CLOSED: 'closed'
    },

    // Transaction types
    TRANSACTION_TYPES: {
        TRANSFER: 'transfer',
        PAYMENT: 'payment',
        LOAD: 'load',
        REFUND: 'refund'
    },

    // Transaction status
    TRANSACTION_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REVERSED: 'reversed'
    }
};
