const { Wallet, Transaction, User } = require('../models');
const sequelize = require('../config/database');
const { generateTransactionRef } = require('../utils/helpers');

/**
 * @route   GET /api/wallet/balance
 * @desc    Get wallet balance
 * @access  Private
 */
exports.getBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ where: { userId: req.user.id } });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        res.json({
            success: true,
            balance: parseFloat(wallet.balance),
            currency: wallet.currency,
            status: wallet.status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   POST /api/wallet/load
 * @desc    Load funds into wallet (simulate top-up)
 * @access  Private
 */
exports.loadFunds = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { amount } = req.body;
        const numAmount = parseFloat(amount);

        if (numAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        const wallet = await Wallet.findOne({
            where: { userId: req.user.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!wallet) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        if (wallet.status === 'frozen') {
            await t.rollback();
            return res.status(403).json({
                success: false,
                message: 'Wallet is frozen'
            });
        }

        // Update balance
        const newBalance = parseFloat(wallet.balance) + numAmount;
        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        // Create transaction record
        const transactionRef = generateTransactionRef();
        await Transaction.create({
            transactionRef,
            senderId: req.user.id,
            senderName: 'System',
            receiverId: req.user.id,
            receiverName: req.user.name,
            amount: numAmount,
            fee: 0,
            type: 'load',
            status: 'completed',
            description: 'Wallet top-up',
            category: 'Deposit',
            completedAt: new Date()
        }, { transaction: t });

        await t.commit();

        res.json({
            success: true,
            message: 'Funds loaded successfully',
            newBalance,
            transactionRef
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
 * @route   GET /api/wallet/summary
 * @desc    Get wallet summary with recent activity
 * @access  Private
 */
exports.getWalletSummary = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ where: { userId: req.user.id } });

        // Get today's spending
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { Op } = require('sequelize');

        const todaySpent = await Transaction.sum('amount', {
            where: {
                senderId: req.user.id,
                type: { [Op.in]: ['transfer', 'payment'] },
                status: 'completed',
                createdAt: { [Op.gte]: today }
            }
        }) || 0;

        // Get this month's stats
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const monthSent = await Transaction.sum('amount', {
            where: {
                senderId: req.user.id,
                type: { [Op.in]: ['transfer', 'payment'] },
                status: 'completed',
                createdAt: { [Op.gte]: monthStart }
            }
        }) || 0;

        const monthReceived = await Transaction.sum('amount', {
            where: {
                receiverId: req.user.id,
                type: { [Op.in]: ['transfer', 'payment'] },
                status: 'completed',
                createdAt: { [Op.gte]: monthStart }
            }
        }) || 0;

        res.json({
            success: true,
            summary: {
                balance: parseFloat(wallet.balance),
                currency: wallet.currency,
                dailyLimit: parseFloat(req.user.dailyLimit),
                dailySpent: parseFloat(todaySpent),
                dailyRemaining: parseFloat(req.user.dailyLimit) - parseFloat(todaySpent),
                monthSent: parseFloat(monthSent),
                monthReceived: parseFloat(monthReceived)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
