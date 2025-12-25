const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    pin: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'merchant', 'admin'),
        defaultValue: 'student'
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended', 'closed'),
        defaultValue: 'active'
    },
    profilePicture: {
        type: DataTypes.STRING
    },
    dailyLimit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 50000
    },
    lastLogin: {
        type: DataTypes.DATE
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.pin) {
                user.pin = await bcrypt.hash(user.pin, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('pin')) {
                user.pin = await bcrypt.hash(user.pin, 10);
            }
        }
    },
    timestamps: true
});

// Instance method to compare PIN
User.prototype.comparePin = async function (pin) {
    return await bcrypt.compare(pin, this.pin);
};

module.exports = User;
