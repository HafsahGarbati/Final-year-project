const { Transaction, Wallet, User } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { generateTransactionRef, getTodayRange, calculateFee } = require('../utils/helpers');
const { MIN_TRANSACTION_AMOUNT, MAX_TRANSACTION_AMOUNT } = require('../config/constants');

/**
 * @route   POST /api/transactions/send
 * @desc    Send money to another user
 * @access  Private
 */
exports.sendMoney = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { receiverStudentId, amount, description } = req.body;
        const numAmount = parseFloat(amount);

        // Validate amount
        if (numAmount < MIN_TRANSACTION_AMOUNT || numAmount > MAX_TRANSACTION_AMOUNT) {
            return res.status(400).json({
                success: false,
                message: `Amount must be between ₦${MIN_TRANSACTION_AMOUNT} and ₦${MAX_TRANSACTION_AMOUNT}`
            });
        }

        // Find receiver
        const receiver = await User.findOne({
            where: { studentId: receiverStudentId.toUpperCase() }
        });

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found'
            });
        }

        if (receiver.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send money to yourself'
            });
        }

        if (receiver.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Receiver account is not active'
            });
        }

        // Get wallets with lock
        const senderWallet = await Wallet.findOne({
            where: { userId: req.user.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        const receiverWallet = await Wallet.findOne({
            where: { userId: receiver.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!senderWallet || !receiverWallet) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        if (senderWallet.status === 'frozen') {
            await t.rollback();
            return res.status(403).json({
                success: false,
                message: 'Your wallet is frozen'
            });
        }

        // Check balance
        if (parseFloat(senderWallet.balance) < numAmount) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Check daily limit
        const { start } = getTodayRange();
        const todaySpent = await Transaction.sum('amount', {
            where: {
                senderId: req.user.id,
                type: { [Op.in]: ['transfer', 'payment'] },
                status: 'completed',
                createdAt: { [Op.gte]: start }
            }
        }) || 0;

        if (todaySpent + numAmount > parseFloat(req.user.dailyLimit)) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Daily limit would be exceeded'
            });
        }

        // Calculate fee
        const todayTxCount = await Transaction.count({
            where: {
                senderId: req.user.id,
                createdAt: { [Op.gte]: start }
            }
        });
        const fee = calculateFee(todayTxCount);
        const totalDeduction = numAmount + fee;

        if (parseFloat(senderWallet.balance) < totalDeduction) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance (including fee)'
            });
        }

        // Process transaction
        senderWallet.balance = parseFloat(senderWallet.balance) - totalDeduction;
        receiverWallet.balance = parseFloat(receiverWallet.balance) + numAmount;

        await senderWallet.save({ transaction: t });
        await receiverWallet.save({ transaction: t });

        // Create transaction record
        const transactionRef = generateTransactionRef();
        const transaction = await Transaction.create({
            transactionRef,
            senderId: req.user.id,
            senderName: req.user.name,
            receiverId: receiver.id,
            receiverName: receiver.name,
            amount: numAmount,
            fee,
            type: receiver.role === 'merchant' ? 'payment' : 'transfer',
            status: 'completed',
            description: description || 'Money transfer',
            category: receiver.role === 'merchant' ? 'Payment' : 'Transfer',
            completedAt: new Date()
        }, { transaction: t });

        await t.commit();

        res.json({
            success: true,
            message: 'Transfer successful',
            transaction: {
                id: transaction.id,
                ref: transactionRef,
                amount: numAmount,
                fee,
                receiverName: receiver.name,
                receiverId: receiver.studentId,
                newBalance: parseFloat(senderWallet.balance),
                timestamp: transaction.completedAt
            }
        });
    } catch (error) {
        await t.rollback();
        console.error('Send money error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/transactions/history
 * @desc    Get transaction history
 * @access  Private
 */
exports.getTransactionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            [Op.or]: [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ]
        };

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
                totalItems: count,
                itemsPerPage: parseInt(limit)
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
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction
 * @access  Private
 */
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                [Op.or]: [
                    { senderId: req.user.id },
                    { receiverId: req.user.id }
                ]
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/transactions/recent
 * @desc    Get recent transactions (last 5)
 * @access  Private
 */
exports.getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id },
                    { receiverId: req.user.id }
                ]
            },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
