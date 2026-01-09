/**
 * Generate unique transaction reference
 */
exports.generateTransactionRef = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REF-${timestamp}-${random}`;
};

/**
 * Format currency for display
 */
exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
};

/**
 * Get today's date range (start and end)
 */
exports.getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { start, end };
};

/**
 * Calculate transaction fee
 */
exports.calculateFee = (dailyTransactionCount, isEligibleForFreeFee = true) => {
    const FREE_TRANSACTIONS = 5;
    const FEE_AMOUNT = 5;

    if (isEligibleForFreeFee && dailyTransactionCount < FREE_TRANSACTIONS) {
        return 0;
    }
    return FEE_AMOUNT;
};

/**
 * Sanitize user object (remove sensitive fields)
 */
exports.sanitizeUser = (user) => {
    const { pin, ...sanitized } = user.toJSON ? user.toJSON() : user;
    return sanitized;
};
