const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Registration validation rules
exports.registerRules = [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('pin').isLength({ min: 4, max: 4 }).withMessage('PIN must be 4 digits')
];

// Login validation rules
exports.loginRules = [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('pin').notEmpty().withMessage('PIN is required')
];

// Send money validation rules
exports.sendMoneyRules = [
    body('receiverStudentId').notEmpty().withMessage('Receiver ID is required'),
    body('amount').isFloat({ min: 10, max: 50000 }).withMessage('Amount must be between ₦10 and ₦50,000'),
    body('description').optional().isString()
];

// Load funds validation rules
exports.loadFundsRules = [
    body('amount').isFloat({ min: 100 }).withMessage('Minimum load amount is ₦100')
];
