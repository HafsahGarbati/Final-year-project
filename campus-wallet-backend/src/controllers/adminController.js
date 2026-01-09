const { User, Wallet, Transaction, Merchant } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status, search, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { studentId: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { rows: users, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['pin'] },
            include: [{ model: Wallet, as: 'wallet' }],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
                totalItems: count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Private (Admin only)
 */
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['pin'] },
            include: [
                { model: Wallet, as: 'wallet' },
                { model: Merchant, as: 'merchantProfile' }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get recent transactions
        const transactions = await Transaction.findAll({
            where: {
                [Op.or]: [
                    { senderId: user.id },
                    { receiverId: user.id }
                ]
            },
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            user,
            recentTransactions: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user status (suspend/activate)
 * @access  Private (Admin only)
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot modify admin accounts'
            });
        }

        user.status = status;
        await user.save();

        res.json({
            success: true,
            message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
            user: {
                id: user.id,
                studentId: user.studentId,
                name: user.name,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   POST /api/admin/users/:id/add-funds
 * @desc    Add funds to user wallet (admin credit)
 * @access  Private (Admin only)
 */
exports.addFundsToUser = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { amount, reason } = req.body;
        const numAmount = parseFloat(amount);

        const user = await User.findByPk(req.params.id);
        if (!user) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const wallet = await Wallet.findOne({
            where: { userId: user.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        wallet.balance = parseFloat(wallet.balance) + numAmount;
        await wallet.save({ transaction: t });

        // Create transaction record
        const { generateTransactionRef } = require('../utils/helpers');
        await Transaction.create({
            transactionRef: generateTransactionRef(),
            senderId: req.user.id,
            senderName: 'Admin Credit',
            receiverId: user.id,
            receiverName: user.name,
            amount: numAmount,
            fee: 0,
            type: 'load',
            status: 'completed',
            description: reason || 'Admin credit',
            category: 'Admin',
            completedAt: new Date()
        }, { transaction: t });

        await t.commit();

        res.json({
            success: true,
            message: 'Funds added successfully',
            newBalance: parseFloat(wallet.balance)
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions
 * @access  Private (Admin only)
 */
exports.getAllTransactions = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const { rows: transactions, count } = await Transaction.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
                totalItems: count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Private (Admin only)
 */
exports.getSystemStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // User counts
        const totalUsers = await User.count();
        const totalStudents = await User.count({ where: { role: 'student' } });
        const totalMerchants = await User.count({ where: { role: 'merchant' } });
        const activeUsers = await User.count({ where: { status: 'active' } });
        const suspendedUsers = await User.count({ where: { status: 'suspended' } });

        // Transaction counts
        const totalTransactions = await Transaction.count();
        const todayTransactions = await Transaction.count({
            where: { createdAt: { [Op.gte]: today } }
        });
        const todayVolume = await Transaction.sum('amount', {
            where: { createdAt: { [Op.gte]: today }, status: 'completed' }
        }) || 0;

        // System balance
        const totalSystemBalance = await Wallet.sum('balance') || 0;

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    merchants: totalMerchants,
                    active: activeUsers,
                    suspended: suspendedUsers
                },
                transactions: {
                    total: totalTransactions,
                    today: todayTransactions,
                    todayVolume: parseFloat(todayVolume)
                },
                systemBalance: parseFloat(totalSystemBalance)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
