const { Transaction, User, Wallet, Merchant } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { generateTransactionRef, getTodayRange, calculateFee } = require('../utils/helpers');

/**
 * @route   POST /api/merchants/process-payment
 * @desc    Process payment from student (merchant initiated)
 * @access  Private (Merchant only)
 */
exports.processPayment = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { studentId, amount, description } = req.body;
        const numAmount = parseFloat(amount);

        // Validate amount
        if (numAmount < 10 || numAmount > 50000) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be between ₦10 and ₦50,000'
            });
        }

        // Find student
        const student = await User.findOne({
            where: { studentId: studentId.toUpperCase(), role: 'student' }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Student account is not active'
            });
        }

        // Get wallets
        const studentWallet = await Wallet.findOne({
            where: { userId: student.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        const merchantWallet = await Wallet.findOne({
            where: { userId: req.user.id },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        // Check student balance
        if (parseFloat(studentWallet.balance) < numAmount) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Student has insufficient balance'
            });
        }

        // Get merchant profile for commission
        const merchantProfile = await Merchant.findOne({ where: { userId: req.user.id } });
        const commission = (parseFloat(merchantProfile?.commissionRate || 1.5) / 100) * numAmount;
        const netAmount = numAmount - commission;

        // Process payment
        studentWallet.balance = parseFloat(studentWallet.balance) - numAmount;
        merchantWallet.balance = parseFloat(merchantWallet.balance) + netAmount;

        await studentWallet.save({ transaction: t });
        await merchantWallet.save({ transaction: t });

        // Create transaction
        const transactionRef = generateTransactionRef();
        const transaction = await Transaction.create({
            transactionRef,
            senderId: student.id,
            senderName: student.name,
            receiverId: req.user.id,
            receiverName: req.user.name,
            amount: numAmount,
            fee: commission,
            type: 'payment',
            status: 'completed',
            description: description || 'Merchant payment',
            category: merchantProfile?.businessType || 'Payment',
            completedAt: new Date()
        }, { transaction: t });

        await t.commit();

        res.json({
            success: true,
            message: 'Payment processed successfully',
            transaction: {
                ref: transactionRef,
                amount: numAmount,
                fee: commission,
                netAmount,
                studentName: student.name,
                timestamp: transaction.completedAt
            }
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
 * @route   GET /api/merchants/sales
 * @desc    Get merchant sales data
 * @access  Private (Merchant only)
 */
exports.getSales = async (req, res) => {
    try {
        const { period = 'today' } = req.query;

        let startDate;
        const endDate = new Date();

        switch (period) {
            case 'today':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            default:
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
        }

        const sales = await Transaction.findAll({
            where: {
                receiverId: req.user.id,
                type: 'payment',
                status: 'completed',
                createdAt: { [Op.between]: [startDate, endDate] }
            },
            order: [['createdAt', 'DESC']]
        });

        const totalSales = sales.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        const totalFees = sales.reduce((sum, tx) => sum + parseFloat(tx.fee), 0);
        const netRevenue = totalSales - totalFees;

        res.json({
            success: true,
            period,
            sales: {
                transactions: sales,
                totalSales,
                totalFees,
                netRevenue,
                transactionCount: sales.length
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
 * @route   GET /api/merchants/stats
 * @desc    Get merchant dashboard stats
 * @access  Private (Merchant only)
 */
exports.getStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const monthStart = new Date();
        monthStart.setDate(1);

        // Today's sales
        const todaySales = await Transaction.findAll({
            where: {
                receiverId: req.user.id,
                type: 'payment',
                status: 'completed',
                createdAt: { [Op.gte]: today }
            }
        });

        // Week sales
        const weekSales = await Transaction.findAll({
            where: {
                receiverId: req.user.id,
                type: 'payment',
                status: 'completed',
                createdAt: { [Op.gte]: weekStart }
            }
        });

        // Month sales
        const monthSales = await Transaction.findAll({
            where: {
                receiverId: req.user.id,
                type: 'payment',
                status: 'completed',
                createdAt: { [Op.gte]: monthStart }
            }
        });

        res.json({
            success: true,
            stats: {
                today: {
                    total: todaySales.reduce((s, t) => s + parseFloat(t.amount), 0),
                    count: todaySales.length
                },
                week: {
                    total: weekSales.reduce((s, t) => s + parseFloat(t.amount), 0),
                    count: weekSales.length
                },
                month: {
                    total: monthSales.reduce((s, t) => s + parseFloat(t.amount), 0),
                    count: monthSales.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
