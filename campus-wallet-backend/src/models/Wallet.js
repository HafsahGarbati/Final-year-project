const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wallet = sequelize.define('Wallet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN'
    },
    version: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM('active', 'frozen'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = Wallet;
