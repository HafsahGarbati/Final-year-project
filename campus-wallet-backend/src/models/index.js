const User = require('./User');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const Merchant = require('./Merchant');

// User <-> Wallet (1:1)
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Merchant (1:1)
User.hasOne(Merchant, { foreignKey: 'userId', as: 'merchantProfile' });
Merchant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Transaction (1:many as sender)
User.hasMany(Transaction, { foreignKey: 'senderId', as: 'sentTransactions' });
Transaction.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// User <-> Transaction (1:many as receiver)
User.hasMany(Transaction, { foreignKey: 'receiverId', as: 'receivedTransactions' });
Transaction.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = {
    User,
    Wallet,
    Transaction,
    Merchant
};
