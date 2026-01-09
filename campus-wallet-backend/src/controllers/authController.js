const jwt = require('jsonwebtoken');
const { User, Wallet, Merchant } = require('../models');
const { sanitizeUser } = require('../utils/helpers');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        const { studentId, name, email, phone, pin, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { studentId } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this ID already exists'
            });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            studentId: studentId.toUpperCase(),
            name,
            email,
            phone,
            pin,
            role: role || 'student'
        });

        // Create wallet with 0 balance
        await Wallet.create({ userId: user.id, balance: 0 });

        // If merchant, create merchant profile
        if (role === 'merchant' && req.body.businessName) {
            await Merchant.create({
                userId: user.id,
                businessName: req.body.businessName,
                businessType: req.body.businessType,
                location: req.body.location
            });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { studentId, pin } = req.body;

        // Find user
        const user = await User.findOne({
            where: { studentId: studentId.toUpperCase() }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check PIN
        const isMatch = await user.comparePin(pin);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check status
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is suspended or closed'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Get wallet
        const wallet = await Wallet.findOne({ where: { userId: user.id } });

        // Get merchant profile if applicable
        let merchantProfile = null;
        if (user.role === 'merchant') {
            merchantProfile = await Merchant.findOne({ where: { userId: user.id } });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                ...sanitizeUser(user),
                walletBalance: parseFloat(wallet?.balance || 0),
                ...(merchantProfile && {
                    businessName: merchantProfile.businessName,
                    businessType: merchantProfile.businessType,
                    location: merchantProfile.location
                })
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ where: { userId: req.user.id } });

        let merchantProfile = null;
        if (req.user.role === 'merchant') {
            merchantProfile = await Merchant.findOne({ where: { userId: req.user.id } });
        }

        res.json({
            success: true,
            user: {
                ...sanitizeUser(req.user),
                walletBalance: parseFloat(wallet?.balance || 0),
                ...(merchantProfile && {
                    businessName: merchantProfile.businessName,
                    businessType: merchantProfile.businessType,
                    location: merchantProfile.location
                })
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
 * @route   PUT /api/auth/change-pin
 * @desc    Change user PIN
 * @access  Private
 */
exports.changePin = async (req, res) => {
    try {
        const { currentPin, newPin } = req.body;

        // Verify current PIN
        const isMatch = await req.user.comparePin(currentPin);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current PIN is incorrect'
            });
        }

        // Update PIN
        req.user.pin = newPin;
        await req.user.save();

        res.json({
            success: true,
            message: 'PIN changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
