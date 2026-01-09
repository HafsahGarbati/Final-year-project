// Utility helper functions for BUK Pay

/**
 * Format currency in Nigerian Naira
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount).replace('NGN', '₦');
};

/**
 * Format date to readable string
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format date to short form
 */
export const formatDateShort = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDateShort(timestamp);
};

/**
 * Validate student ID format (e.g., STU001, MER001)
 */
export const validateId = (id) => {
    if (!id) return false;
    const pattern = /^(STU|MER|ADM)\d{3}$/;
    return pattern.test(id.toUpperCase());
};

/**
 * Validate amount is positive and within limits
 */
export const validateAmount = (amount, balance, dailyLimit, dailySpent = 0) => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
        return { valid: false, error: 'Please enter a valid amount' };
    }

    if (numAmount < 10) {
        return { valid: false, error: 'Minimum transaction amount is ₦10' };
    }

    if (numAmount > 50000) {
        return { valid: false, error: 'Maximum single transaction is ₦50,000' };
    }

    if (numAmount > balance) {
        return { valid: false, error: 'Insufficient balance' };
    }

    if (dailyLimit && (dailySpent + numAmount > dailyLimit)) {
        return { valid: false, error: `Daily limit of ${formatCurrency(dailyLimit)} would be exceeded` };
    }

    return { valid: true };
};

/**
 * Calculate transaction fee (0% for demo)
 */
export const calculateFee = (amount, type = 'transfer') => {
    // For demo purposes, we're not charging fees
    // Can be modified to add fee structure
    return 0;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
    return `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
};

/**
 * Generate transaction reference
 */
export const generateTransactionRef = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `REF-${timestamp}-${random}`;
};

/**
 * Mask PIN for display (e.g., "****")
 */
export const maskPin = (pin) => {
    return '•'.repeat(pin.length);
};

/**
 * Get initials from name (e.g., "JD" from "John Doe")
 */
export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

/**
 * Get transaction type label
 */
export const getTransactionTypeLabel = (type) => {
    const labels = {
        payment: 'Payment',
        transfer: 'Transfer',
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        refund: 'Refund'
    };
    return labels[type] || type;
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
    const colors = {
        completed: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        failed: 'bg-red-100 text-red-700',
        active: 'bg-emerald-100 text-emerald-700',
        suspended: 'bg-red-100 text-red-700',
        inactive: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
};

/**
 * Simulate async delay (for realistic loading)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate random amount for demo
 */
export const generateRandomAmount = (min = 100, max = 5000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Check if date is today
 */
export const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
