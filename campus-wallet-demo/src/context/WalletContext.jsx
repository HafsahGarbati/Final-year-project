import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialTransactions, generateTransactionRef, generateId } from '../data/mockData';
import { loadTransactions, saveTransactions } from '../utils/localStorage';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { formatCurrency, validateAmount, delay } from '../utils/helpers';

const WalletContext = createContext(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser, updateUser, getUserById, users, setUsers } = useAuth();
    const { showNotification } = useNotification();

    // Initialize transactions on mount
    useEffect(() => {
        const storedTransactions = loadTransactions(initialTransactions);
        setTransactions(storedTransactions);
    }, []);

    // Get current user balance
    const getBalance = useCallback((userId = null) => {
        const id = userId || currentUser?.id;
        if (!id) return 0;
        const user = getUserById(id);
        return user?.walletBalance || 0;
    }, [currentUser, getUserById]);

    // Get transaction history for a user
    const getTransactionHistory = useCallback((userId = null, limit = 50) => {
        const id = userId || currentUser?.id;
        if (!id) return [];

        return transactions
            .filter(txn => txn.senderId === id || txn.receiverId === id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }, [currentUser, transactions]);

    // Get recent transactions for dashboard
    const getRecentTransactions = useCallback((limit = 5) => {
        return getTransactionHistory(null, limit);
    }, [getTransactionHistory]);

    // Send money to another user
    const sendMoney = useCallback(async (receiverId, amount, description = '') => {
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        setLoading(true);

        try {
            // Validate recipient
            const receiver = getUserById(receiverId);
            if (!receiver) {
                throw new Error('Recipient not found');
            }
            if (receiver.status === 'suspended') {
                throw new Error('Recipient account is suspended');
            }
            if (receiverId === currentUser.id) {
                throw new Error('Cannot send money to yourself');
            }

            // Validate amount
            const numAmount = parseFloat(amount);
            const validation = validateAmount(
                numAmount,
                currentUser.walletBalance,
                currentUser.dailyLimit,
                currentUser.dailySpent || 0
            );

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Simulate processing delay
            await delay(1500);

            // Create transaction
            const transaction = {
                id: generateId(),
                ref: generateTransactionRef(),
                senderId: currentUser.id,
                senderName: currentUser.name,
                receiverId: receiver.id,
                receiverName: receiver.name,
                amount: numAmount,
                fee: 0,
                type: receiver.role === 'merchant' ? 'payment' : 'transfer',
                status: 'completed',
                description: description || `Transfer to ${receiver.name}`,
                timestamp: new Date().toISOString(),
                category: receiver.businessType || 'Transfer'
            };

            // Update balances
            const newSenderBalance = currentUser.walletBalance - numAmount;
            const newReceiverBalance = (receiver.walletBalance || 0) + numAmount;
            const newDailySpent = (currentUser.dailySpent || 0) + numAmount;

            // Update users
            updateUser(currentUser.id, {
                walletBalance: newSenderBalance,
                dailySpent: newDailySpent
            });
            updateUser(receiver.id, { walletBalance: newReceiverBalance });

            // Save transaction
            const updatedTransactions = [transaction, ...transactions];
            setTransactions(updatedTransactions);
            saveTransactions(updatedTransactions);

            setLoading(false);
            showNotification('success', `Successfully sent ${formatCurrency(numAmount)} to ${receiver.name}`);

            return {
                success: true,
                transaction,
                newBalance: newSenderBalance
            };
        } catch (error) {
            setLoading(false);
            showNotification('error', error.message);
            return { success: false, error: error.message };
        }
    }, [currentUser, getUserById, updateUser, transactions, showNotification]);

    // Load funds into wallet (simulated)
    const loadFunds = useCallback(async (amount, source = 'Bank Transfer') => {
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        setLoading(true);

        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                throw new Error('Invalid amount');
            }
            if (numAmount < 100) {
                throw new Error('Minimum deposit is ₦100');
            }

            // Simulate processing delay
            await delay(2000);

            // Create deposit transaction
            const transaction = {
                id: generateId(),
                ref: generateTransactionRef(),
                senderId: 'SYSTEM',
                senderName: 'System',
                receiverId: currentUser.id,
                receiverName: currentUser.name,
                amount: numAmount,
                fee: 0,
                type: 'deposit',
                status: 'completed',
                description: `Wallet top-up via ${source}`,
                timestamp: new Date().toISOString(),
                category: 'Deposit'
            };

            // Update balance
            const newBalance = currentUser.walletBalance + numAmount;
            updateUser(currentUser.id, { walletBalance: newBalance });

            // Save transaction
            const updatedTransactions = [transaction, ...transactions];
            setTransactions(updatedTransactions);
            saveTransactions(updatedTransactions);

            setLoading(false);
            showNotification('success', `Successfully loaded ${formatCurrency(numAmount)}`);

            return {
                success: true,
                transaction,
                newBalance
            };
        } catch (error) {
            setLoading(false);
            showNotification('error', error.message);
            return { success: false, error: error.message };
        }
    }, [currentUser, updateUser, transactions, showNotification]);

    // Process payment (for merchants)
    const processPayment = useCallback(async (payerId, amount, description = '') => {
        if (!currentUser || currentUser.role !== 'merchant') {
            return { success: false, error: 'Not authorized' };
        }

        setLoading(true);

        try {
            // Validate payer
            const payer = getUserById(payerId);
            if (!payer) {
                throw new Error('Student not found');
            }
            if (payer.status === 'suspended') {
                throw new Error('Student account is suspended');
            }
            if (payer.role !== 'student') {
                throw new Error('Can only accept payments from students');
            }

            // Validate amount
            const numAmount = parseFloat(amount);
            const validation = validateAmount(
                numAmount,
                payer.walletBalance,
                payer.dailyLimit,
                payer.dailySpent || 0
            );

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Simulate processing delay
            await delay(1500);

            // Create transaction
            const transaction = {
                id: generateId(),
                ref: generateTransactionRef(),
                senderId: payer.id,
                senderName: payer.name,
                receiverId: currentUser.id,
                receiverName: currentUser.name,
                amount: numAmount,
                fee: 0,
                type: 'payment',
                status: 'completed',
                description: description || `Payment to ${currentUser.name}`,
                timestamp: new Date().toISOString(),
                category: currentUser.businessType || 'Payment'
            };

            // Update balances
            const newPayerBalance = payer.walletBalance - numAmount;
            const newMerchantBalance = currentUser.walletBalance + numAmount;
            const newDailySpent = (payer.dailySpent || 0) + numAmount;

            // Update users directly in the users array
            const updatedUsers = users.map(u => {
                if (u.id === payer.id) {
                    return { ...u, walletBalance: newPayerBalance, dailySpent: newDailySpent };
                }
                if (u.id === currentUser.id) {
                    return { ...u, walletBalance: newMerchantBalance };
                }
                return u;
            });

            setUsers(updatedUsers);

            // Save transaction
            const updatedTransactions = [transaction, ...transactions];
            setTransactions(updatedTransactions);
            saveTransactions(updatedTransactions);

            setLoading(false);
            showNotification('success', `Payment of ${formatCurrency(numAmount)} received from ${payer.name}`);

            return {
                success: true,
                transaction,
                payer: { ...payer, walletBalance: newPayerBalance },
                newBalance: newMerchantBalance
            };
        } catch (error) {
            setLoading(false);
            showNotification('error', error.message);
            return { success: false, error: error.message };
        }
    }, [currentUser, getUserById, users, setUsers, transactions, showNotification]);

    // Get all transactions (for admin)
    const getAllTransactions = useCallback((limit = 100) => {
        return transactions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }, [transactions]);

    // Get merchant sales summary
    const getMerchantSales = useCallback((merchantId = null, startDate = null, endDate = null) => {
        const id = merchantId || currentUser?.id;
        if (!id) return { total: 0, count: 0, transactions: [] };

        const now = new Date();
        const start = startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = endDate || now;

        const merchantTxns = transactions.filter(txn => {
            const txnDate = new Date(txn.timestamp);
            return txn.receiverId === id &&
                txn.type === 'payment' &&
                txn.status === 'completed' &&
                txnDate >= start &&
                txnDate <= end;
        });

        return {
            total: merchantTxns.reduce((sum, txn) => sum + txn.amount, 0),
            count: merchantTxns.length,
            transactions: merchantTxns
        };
    }, [currentUser, transactions]);

    // Reset transactions to initial state
    const resetTransactions = useCallback(() => {
        setTransactions(initialTransactions);
        saveTransactions(initialTransactions);
    }, []);

    // Refresh balance from storage
    const refreshBalance = useCallback(() => {
        if (currentUser) {
            const user = getUserById(currentUser.id);
            return user?.walletBalance || 0;
        }
        return 0;
    }, [currentUser, getUserById]);

    const value = {
        transactions,
        loading,
        getBalance,
        getTransactionHistory,
        getRecentTransactions,
        sendMoney,
        loadFunds,
        processPayment,
        getAllTransactions,
        getMerchantSales,
        resetTransactions,
        refreshBalance,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export default WalletContext;
