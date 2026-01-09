const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Merchant = sequelize.define('Merchant', {
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
    businessName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    businessType: {
        type: DataTypes.STRING(50)
    },
    location: {
        type: DataTypes.STRING(200)
    },
    commissionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 1.5
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = Merchant;
