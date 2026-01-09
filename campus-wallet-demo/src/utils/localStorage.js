// LocalStorage utilities for BUK Pay

const STORAGE_KEYS = {
    USERS: 'campusWallet_users',
    TRANSACTIONS: 'campusWallet_transactions',
    CURRENT_USER: 'campusWallet_currentUser',
    SETTINGS: 'campusWallet_settings'
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Load data from localStorage
 */
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

/**
 * Clear all BUK Pay data
 */
export const clearAllStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};

/**
 * Export all data to JSON for backup
 */
export const exportData = () => {
    const data = {
        users: loadFromStorage(STORAGE_KEYS.USERS),
        transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS),
        settings: loadFromStorage(STORAGE_KEYS.SETTINGS),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-wallet-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Import data from JSON backup
 */
export const importData = (jsonData) => {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        if (data.users) saveToStorage(STORAGE_KEYS.USERS, data.users);
        if (data.transactions) saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
        if (data.settings) saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);

        return { success: true };
    } catch (error) {
        console.error('Error importing data:', error);
        return { success: false, error: error.message };
    }
};

// Export storage keys for use in contexts
export { STORAGE_KEYS };

// Convenience functions for specific data types
export const saveUsers = (users) => saveToStorage(STORAGE_KEYS.USERS, users);
export const loadUsers = (defaultValue) => loadFromStorage(STORAGE_KEYS.USERS, defaultValue);

export const saveTransactions = (transactions) => saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
export const loadTransactions = (defaultValue) => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, defaultValue);

export const saveCurrentUser = (user) => saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
export const loadCurrentUser = () => loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
export const clearCurrentUser = () => removeFromStorage(STORAGE_KEYS.CURRENT_USER);

export const saveSettings = (settings) => saveToStorage(STORAGE_KEYS.SETTINGS, settings);
export const loadSettings = (defaultValue) => loadFromStorage(STORAGE_KEYS.SETTINGS, defaultValue);
