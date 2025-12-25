import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialUsers, findUserById, authenticateUser as authUser } from '../data/mockData';
import { loadUsers, saveUsers, loadCurrentUser, saveCurrentUser, clearCurrentUser } from '../utils/localStorage';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize data on mount
    useEffect(() => {
        const initializeData = () => {
            // Load users from storage or use initial data
            const storedUsers = loadUsers(initialUsers);
            setUsers(storedUsers);

            // Check for existing session
            const storedUser = loadCurrentUser();
            if (storedUser) {
                // Verify user still exists and is active
                const user = findUserById(storedUsers, storedUser.id);
                if (user && user.status === 'active') {
                    setCurrentUser(user);
                } else {
                    clearCurrentUser();
                }
            }
            setLoading(false);
        };

        initializeData();
    }, []);

    // Login function
    const login = useCallback(async (id, pin) => {
        setError(null);
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = authUser(users, id.toUpperCase(), pin);

        if (result.success) {
            // Update last login time
            const updatedUser = {
                ...result.user,
                lastLogin: new Date().toISOString()
            };

            // Update users array
            const updatedUsers = users.map(u =>
                u.id === updatedUser.id ? updatedUser : u
            );

            setUsers(updatedUsers);
            setCurrentUser(updatedUser);
            saveUsers(updatedUsers);
            saveCurrentUser(updatedUser);
            setLoading(false);
            return { success: true, user: updatedUser };
        } else {
            setError(result.error);
            setLoading(false);
            return { success: false, error: result.error };
        }
    }, [users]);

    // Logout function
    const logout = useCallback(() => {
        setCurrentUser(null);
        clearCurrentUser();
        setError(null);
    }, []);

    // Update user data
    const updateUser = useCallback((userId, updates) => {
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, ...updates } : u
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);

        // Update current user if it's the logged-in user
        if (currentUser && currentUser.id === userId) {
            const updatedCurrentUser = { ...currentUser, ...updates };
            setCurrentUser(updatedCurrentUser);
            saveCurrentUser(updatedCurrentUser);
        }
    }, [users, currentUser]);

    // Change PIN
    const changePin = useCallback(async (userId, currentPin, newPin) => {
        const user = findUserById(users, userId);
        if (!user) return { success: false, error: 'User not found' };
        if (user.pin !== currentPin) return { success: false, error: 'Current PIN is incorrect' };
        if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
            return { success: false, error: 'PIN must be 4 digits' };
        }

        updateUser(userId, { pin: newPin });
        return { success: true };
    }, [users, updateUser]);

    // Get user by ID
    const getUserById = useCallback((id) => {
        return findUserById(users, id);
    }, [users]);

    // Get all users (for admin)
    const getAllUsers = useCallback(() => {
        return users;
    }, [users]);

    // Toggle user status (for admin)
    const toggleUserStatus = useCallback((userId) => {
        const user = findUserById(users, userId);
        if (!user) return { success: false, error: 'User not found' };

        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        updateUser(userId, { status: newStatus });
        return { success: true, status: newStatus };
    }, [users, updateUser]);

    // Add funds to user wallet (for admin)
    const addFundsToUser = useCallback((userId, amount) => {
        const user = findUserById(users, userId);
        if (!user) return { success: false, error: 'User not found' };
        if (!user.walletBalance && user.walletBalance !== 0) {
            return { success: false, error: 'User does not have a wallet' };
        }

        const newBalance = user.walletBalance + parseFloat(amount);
        updateUser(userId, { walletBalance: newBalance });
        return { success: true, newBalance };
    }, [users, updateUser]);

    // Refresh current user data from storage
    const refreshCurrentUser = useCallback(() => {
        if (currentUser) {
            const user = findUserById(users, currentUser.id);
            if (user) {
                setCurrentUser(user);
                saveCurrentUser(user);
            }
        }
    }, [currentUser, users]);

    // Reset data to initial state
    const resetData = useCallback(() => {
        setUsers(initialUsers);
        saveUsers(initialUsers);
        if (currentUser) {
            const user = findUserById(initialUsers, currentUser.id);
            if (user) {
                setCurrentUser(user);
                saveCurrentUser(user);
            } else {
                logout();
            }
        }
    }, [currentUser, logout]);

    const value = {
        currentUser,
        users,
        loading,
        error,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateUser,
        changePin,
        getUserById,
        getAllUsers,
        toggleUserStatus,
        addFundsToUser,
        refreshCurrentUser,
        resetData,
        setUsers,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
