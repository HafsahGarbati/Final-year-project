/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: messages
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry - this record already exists'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Default server error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;
