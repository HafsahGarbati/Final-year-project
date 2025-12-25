// Mock Data for BUK Pay Demo
// This file contains all initial data and helper functions for the demo

// ============================================
// INITIAL USERS DATA
// ============================================
export const initialUsers = [
    // Students
    {
        id: 'STU001',
        studentId: 'STU001',
        name: 'John Doe',
        email: 'john.doe@campus.edu',
        phone: '08012345678',
        pin: '1234',
        role: 'student',
        walletBalance: 25000,
        dailyLimit: 50000,
        dailySpent: 0,
        profilePicture: null,
        status: 'active',
        createdAt: '2024-09-01T08:00:00',
        lastLogin: '2024-12-20T09:30:00'
    },
    {
        id: 'STU002',
        studentId: 'STU002',
        name: 'Sarah Johnson',
        email: 'sarah.j@campus.edu',
        phone: '08023456789',
        pin: '1234',
        role: 'student',
        walletBalance: 15500,
        dailyLimit: 50000,
        dailySpent: 2500,
        profilePicture: null,
        status: 'active',
        createdAt: '2024-09-01T08:00:00',
        lastLogin: '2024-12-20T10:15:00'
    },
    {
        id: 'STU003',
        studentId: 'STU003',
        name: 'Michael Chen',
        email: 'michael.c@campus.edu',
        phone: '08034567890',
        pin: '1234',
        role: 'student',
        walletBalance: 8750,
        dailyLimit: 50000,
        dailySpent: 5000,
        profilePicture: null,
        status: 'active',
        createdAt: '2024-09-15T08:00:00',
        lastLogin: '2024-12-19T14:20:00'
    },
    {
        id: 'STU004',
        studentId: 'STU004',
        name: 'Emily Brown',
        email: 'emily.b@campus.edu',
        phone: '08045678901',
        pin: '1234',
        role: 'student',
        walletBalance: 42000,
        dailyLimit: 50000,
        dailySpent: 0,
        profilePicture: null,
        status: 'active',
        createdAt: '2024-09-15T08:00:00',
        lastLogin: '2024-12-20T08:45:00'
    },
    {
        id: 'STU005',
        studentId: 'STU005',
        name: 'David Wilson',
        email: 'david.w@campus.edu',
        phone: '08056789012',
        pin: '1234',
        role: 'student',
        walletBalance: 3200,
        dailyLimit: 50000,
        dailySpent: 12000,
        profilePicture: null,
        status: 'suspended',
        createdAt: '2024-10-01T08:00:00',
        lastLogin: '2024-12-18T16:30:00'
    },
    // Merchants
    {
        id: 'MER001',
        merchantId: 'MER001',
        name: 'Campus Cafeteria',
        email: 'cafeteria@campus.edu',
        phone: '08067890123',
        pin: '1234',
        role: 'merchant',
        businessType: 'Food & Beverage',
        location: 'Main Building, Ground Floor',
        walletBalance: 150000,
        commissionRate: 1.5,
        status: 'active',
        createdAt: '2024-08-01T08:00:00',
        lastLogin: '2024-12-20T06:00:00'
    },
    {
        id: 'MER002',
        merchantId: 'MER002',
        name: 'Campus Bookstore',
        email: 'bookstore@campus.edu',
        phone: '08078901234',
        pin: '1234',
        role: 'merchant',
        businessType: 'Retail',
        location: 'Library Building',
        walletBalance: 85000,
        commissionRate: 2.0,
        status: 'active',
        createdAt: '2024-08-01T08:00:00',
        lastLogin: '2024-12-20T08:30:00'
    },
    {
        id: 'MER003',
        merchantId: 'MER003',
        name: 'Print & Copy Center',
        email: 'printcenter@campus.edu',
        phone: '08089012345',
        pin: '1234',
        role: 'merchant',
        businessType: 'Services',
        location: 'Admin Block',
        walletBalance: 25000,
        commissionRate: 1.0,
        status: 'active',
        createdAt: '2024-08-15T08:00:00',
        lastLogin: '2024-12-20T09:00:00'
    },
    {
        id: 'MER004',
        merchantId: 'MER004',
        name: 'Campus Pharmacy',
        email: 'pharmacy@campus.edu',
        phone: '08090123456',
        pin: '1234',
        role: 'merchant',
        businessType: 'Healthcare',
        location: 'Health Center',
        walletBalance: 62000,
        commissionRate: 1.5,
        status: 'active',
        createdAt: '2024-08-15T08:00:00',
        lastLogin: '2024-12-19T17:00:00'
    },
    // Admin
    {
        id: 'ADM001',
        adminId: 'ADM001',
        name: 'System Administrator',
        email: 'admin@campus.edu',
        phone: '08001234567',
        pin: '1234',
        role: 'admin',
        status: 'active',
        createdAt: '2024-07-01T08:00:00',
        lastLogin: '2024-12-20T07:00:00'
    }
];

// ============================================
// INITIAL TRANSACTIONS DATA
// ============================================
export const initialTransactions = [
    {
        id: 'TXN001',
        ref: 'REF-2024-001',
        senderId: 'STU001',
        senderName: 'John Doe',
        receiverId: 'MER001',
        receiverName: 'Campus Cafeteria',
        amount: 1500,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Lunch - Rice and Chicken',
        timestamp: '2024-12-20T12:30:00',
        category: 'Food & Beverage'
    },
    {
        id: 'TXN002',
        ref: 'REF-2024-002',
        senderId: 'STU002',
        senderName: 'Sarah Johnson',
        receiverId: 'MER002',
        receiverName: 'Campus Bookstore',
        amount: 4500,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Textbook - Introduction to Economics',
        timestamp: '2024-12-20T10:15:00',
        category: 'Retail'
    },
    {
        id: 'TXN003',
        ref: 'REF-2024-003',
        senderId: 'STU001',
        senderName: 'John Doe',
        receiverId: 'STU002',
        receiverName: 'Sarah Johnson',
        amount: 2000,
        fee: 0,
        type: 'transfer',
        status: 'completed',
        description: 'Group project supplies',
        timestamp: '2024-12-19T16:45:00',
        category: 'Transfer'
    },
    {
        id: 'TXN004',
        ref: 'REF-2024-004',
        senderId: 'STU003',
        senderName: 'Michael Chen',
        receiverId: 'MER001',
        receiverName: 'Campus Cafeteria',
        amount: 800,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Breakfast',
        timestamp: '2024-12-20T08:20:00',
        category: 'Food & Beverage'
    },
    {
        id: 'TXN005',
        ref: 'REF-2024-005',
        senderId: 'STU004',
        senderName: 'Emily Brown',
        receiverId: 'MER003',
        receiverName: 'Print & Copy Center',
        amount: 350,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Print assignment - 35 pages',
        timestamp: '2024-12-19T14:30:00',
        category: 'Services'
    },
    {
        id: 'TXN006',
        ref: 'REF-2024-006',
        senderId: 'STU002',
        senderName: 'Sarah Johnson',
        receiverId: 'MER004',
        receiverName: 'Campus Pharmacy',
        amount: 1200,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Vitamins and supplements',
        timestamp: '2024-12-18T11:00:00',
        category: 'Healthcare'
    },
    {
        id: 'TXN007',
        ref: 'REF-2024-007',
        senderId: 'STU001',
        senderName: 'John Doe',
        receiverId: 'MER001',
        receiverName: 'Campus Cafeteria',
        amount: 650,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Snacks and drinks',
        timestamp: '2024-12-18T15:45:00',
        category: 'Food & Beverage'
    },
    {
        id: 'TXN008',
        ref: 'REF-2024-008',
        senderId: 'STU003',
        senderName: 'Michael Chen',
        receiverId: 'STU004',
        receiverName: 'Emily Brown',
        amount: 500,
        fee: 0,
        type: 'transfer',
        status: 'completed',
        description: 'Splitting dinner bill',
        timestamp: '2024-12-17T19:30:00',
        category: 'Transfer'
    },
    {
        id: 'TXN009',
        ref: 'REF-2024-009',
        senderId: 'STU005',
        senderName: 'David Wilson',
        receiverId: 'MER002',
        receiverName: 'Campus Bookstore',
        amount: 3200,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Stationery and notebooks',
        timestamp: '2024-12-17T09:15:00',
        category: 'Retail'
    },
    {
        id: 'TXN010',
        ref: 'REF-2024-010',
        senderId: 'STU004',
        senderName: 'Emily Brown',
        receiverId: 'MER001',
        receiverName: 'Campus Cafeteria',
        amount: 2100,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Lunch for 2',
        timestamp: '2024-12-16T13:00:00',
        category: 'Food & Beverage'
    },
    {
        id: 'TXN011',
        ref: 'REF-2024-011',
        senderId: 'SYSTEM',
        senderName: 'System',
        receiverId: 'STU001',
        receiverName: 'John Doe',
        amount: 10000,
        fee: 0,
        type: 'deposit',
        status: 'completed',
        description: 'Wallet top-up via bank transfer',
        timestamp: '2024-12-15T10:00:00',
        category: 'Deposit'
    },
    {
        id: 'TXN012',
        ref: 'REF-2024-012',
        senderId: 'STU002',
        senderName: 'Sarah Johnson',
        receiverId: 'MER001',
        receiverName: 'Campus Cafeteria',
        amount: 950,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Dinner',
        timestamp: '2024-12-15T18:30:00',
        category: 'Food & Beverage'
    },
    {
        id: 'TXN013',
        ref: 'REF-2024-013',
        senderId: 'STU001',
        senderName: 'John Doe',
        receiverId: 'MER003',
        receiverName: 'Print & Copy Center',
        amount: 200,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Scan documents - 10 pages',
        timestamp: '2024-12-14T11:20:00',
        category: 'Services'
    },
    {
        id: 'TXN014',
        ref: 'REF-2024-014',
        senderId: 'SYSTEM',
        senderName: 'System',
        receiverId: 'STU002',
        receiverName: 'Sarah Johnson',
        amount: 5000,
        fee: 0,
        type: 'deposit',
        status: 'completed',
        description: 'Wallet top-up',
        timestamp: '2024-12-14T09:00:00',
        category: 'Deposit'
    },
    {
        id: 'TXN015',
        ref: 'REF-2024-015',
        senderId: 'STU003',
        senderName: 'Michael Chen',
        receiverId: 'MER002',
        receiverName: 'Campus Bookstore',
        amount: 1800,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Lab manual',
        timestamp: '2024-12-13T14:45:00',
        category: 'Retail'
    },
    {
        id: 'TXN016',
        ref: 'REF-2024-016',
        senderId: 'STU005',
        senderName: 'David Wilson',
        receiverId: 'STU003',
        receiverName: 'Michael Chen',
        amount: 1500,
        fee: 0,
        type: 'transfer',
        status: 'completed',
        description: 'Paying back lunch money',
        timestamp: '2024-12-12T16:00:00',
        category: 'Transfer'
    },
    {
        id: 'TXN017',
        ref: 'REF-2024-017',
        senderId: 'STU004',
        senderName: 'Emily Brown',
        receiverId: 'MER004',
        receiverName: 'Campus Pharmacy',
        amount: 2500,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'First aid kit',
        timestamp: '2024-12-11T10:30:00',
        category: 'Healthcare'
    },
    {
        id: 'TXN018',
        ref: 'REF-2024-018',
        senderId: 'SYSTEM',
        senderName: 'System',
        receiverId: 'STU004',
        receiverName: 'Emily Brown',
        amount: 20000,
        fee: 0,
        type: 'deposit',
        status: 'completed',
        description: 'Monthly allowance deposit',
        timestamp: '2024-12-10T08:00:00',
        category: 'Deposit'
    },
    {
        id: 'TXN019',
        ref: 'REF-2024-019',
        senderId: 'STU001',
        senderName: 'John Doe',
        receiverId: 'MER002',
        receiverName: 'Campus Bookstore',
        amount: 7500,
        fee: 0,
        type: 'payment',
        status: 'completed',
        description: 'Laptop bag and accessories',
        timestamp: '2024-12-09T13:15:00',
        category: 'Retail'
    },
    {
        id: 'TXN020',
        ref: 'REF-2024-020',
        senderId: 'STU002',
        senderName: 'Sarah Johnson',
        receiverId: 'STU001',
        receiverName: 'John Doe',
        amount: 3000,
        fee: 0,
        type: 'transfer',
        status: 'completed',
        description: 'Repaying borrowed money',
        timestamp: '2024-12-08T17:00:00',
        category: 'Transfer'
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find a user by their student/merchant/admin ID
 */
export const findUserById = (users, id) => {
    return users.find(user =>
        user.id === id ||
        user.studentId === id ||
        user.merchantId === id ||
        user.adminId === id
    );
};

/**
 * Authenticate a user with ID and PIN
 */
export const authenticateUser = (users, id, pin) => {
    const user = findUserById(users, id);
    if (!user) return { success: false, error: 'User not found' };
    if (user.status === 'suspended') return { success: false, error: 'Account is suspended' };
    if (user.pin !== pin) return { success: false, error: 'Invalid PIN' };
    return { success: true, user };
};

/**
 * Get transaction history for a user
 */
export const getTransactionHistory = (transactions, userId, limit = 10) => {
    return transactions
        .filter(txn => txn.senderId === userId || txn.receiverId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
};

/**
 * Get all transactions for merchants (received payments)
 */
export const getMerchantTransactions = (transactions, merchantId, limit = 50) => {
    return transactions
        .filter(txn => txn.receiverId === merchantId && txn.type === 'payment')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
};

/**
 * Generate a unique transaction reference
 */
export const generateTransactionRef = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `REF-${timestamp}-${random}`;
};

/**
 * Generate a unique ID
 */
export const generateId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

/**
 * Calculate merchant sales for a time period
 */
export const calculateMerchantSales = (transactions, merchantId, startDate, endDate) => {
    const filtered = transactions.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txn.receiverId === merchantId &&
            txn.type === 'payment' &&
            txn.status === 'completed' &&
            txnDate >= startDate &&
            txnDate <= endDate;
    });

    return {
        totalSales: filtered.reduce((sum, txn) => sum + txn.amount, 0),
        transactionCount: filtered.length,
        transactions: filtered
    };
};

/**
 * Get today's date range
 */
export const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return { start, end };
};

/**
 * Get this week's date range
 */
export const getWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return { start, end: now };
};

/**
 * Get this month's date range
 */
export const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now };
};

/**
 * Get all students (non-merchants, non-admins)
 */
export const getStudents = (users) => {
    return users.filter(user => user.role === 'student');
};

/**
 * Get all merchants
 */
export const getMerchants = (users) => {
    return users.filter(user => user.role === 'merchant');
};

/**
 * Calculate system statistics
 */
export const getSystemStats = (users, transactions) => {
    const students = getStudents(users);
    const merchants = getMerchants(users);
    const { start, end } = getTodayRange();

    const todayTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txnDate >= start && txnDate <= end;
    });

    return {
        totalUsers: users.length,
        totalStudents: students.length,
        totalMerchants: merchants.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        suspendedUsers: users.filter(u => u.status === 'suspended').length,
        totalTransactions: transactions.length,
        todayTransactions: todayTransactions.length,
        todayVolume: todayTransactions.reduce((sum, txn) => sum + txn.amount, 0),
        totalSystemBalance: users.reduce((sum, user) => sum + (user.walletBalance || 0), 0)
    };
};
