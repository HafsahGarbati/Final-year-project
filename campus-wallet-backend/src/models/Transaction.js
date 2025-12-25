const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    transactionRef: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    senderName: {
        type: DataTypes.STRING(100)
    },
    receiverId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    receiverName: {
        type: DataTypes.STRING(100)
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    type: {
        type: DataTypes.ENUM('transfer', 'payment', 'load', 'refund'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
        defaultValue: 'pending'
    },
    description: {
        type: DataTypes.STRING(255)
    },
    category: {
        type: DataTypes.STRING(50)
    },
    metadata: {
        type: DataTypes.JSON
    },
    completedAt: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true
});

module.exports = Transaction;
