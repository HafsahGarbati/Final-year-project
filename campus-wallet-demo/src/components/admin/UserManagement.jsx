import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
    Search,
    Filter,
    Users,
    Store,
    Shield,
    MoreVertical,
    Eye,
    Ban,
    CheckCircle,
    DollarSign,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Modal from '../shared/Modal';
import { formatCurrency, formatDate, getInitials, getStatusColor } from '../../utils/helpers';

const UserManagement = () => {
    const { getAllUsers, toggleUserStatus, addFundsToUser, getUserById } = useAuth();
    const { showNotification } = useNotification();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [fundsAmount, setFundsAmount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const allUsers = getAllUsers();

    // Filter users
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            // Role filter
            if (filterRole !== 'all' && user.role !== filterRole) return false;

            // Status filter
            if (filterStatus !== 'all' && user.status !== filterStatus) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = user.name?.toLowerCase().includes(query);
                const matchesId = user.id?.toLowerCase().includes(query);
                const matchesEmail = user.email?.toLowerCase().includes(query);
                if (!matchesName && !matchesId && !matchesEmail) return false;
            }

            return true;
        });
    }, [allUsers, filterRole, filterStatus, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle toggle status
    const handleToggleStatus = (userId) => {
        const result = toggleUserStatus(userId);
        if (result.success) {
            showNotification('success', `User ${result.status === 'active' ? 'activated' : 'suspended'}`);
            // Refresh selected user if modal is open
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(getUserById(userId));
            }
        }
    };

    // Handle add funds
    const handleAddFunds = () => {
        if (!selectedUser || !fundsAmount) return;

        const result = addFundsToUser(selectedUser.id, parseFloat(fundsAmount));
        if (result.success) {
            showNotification('success', `Added ${formatCurrency(parseFloat(fundsAmount))} to ${selectedUser.name}`);
            setShowAddFundsModal(false);
            setFundsAmount('');
            setSelectedUser(getUserById(selectedUser.id));
        } else {
            showNotification('error', result.error);
        }
    };

    const roleFilters = [
        { id: 'all', label: 'All Users' },
        { id: 'student', label: 'Students' },
        { id: 'merchant', label: 'Merchants' },
        { id: 'admin', label: 'Admins' },
    ];

    const statusFilters = [
        { id: 'all', label: 'All Status' },
        { id: 'active', label: 'Active' },
        { id: 'suspended', label: 'Suspended' },
    ];

    const getRoleIcon = (role) => {
        switch (role) {
            case 'student': return Users;
            case 'merchant': return Store;
            case 'admin': return Shield;
            default: return Users;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'student': return 'bg-blue-100 text-blue-700';
            case 'merchant': return 'bg-purple-100 text-purple-700';
            case 'admin': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-500">{filteredUsers.length} users found</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by name, ID, or email..."
                            className="input-field pl-12"
                        />
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            {roleFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setFilterRole(filter.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRole === filter.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setFilterStatus(filter.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === filter.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-600">User</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Role</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Balance</th>
                                    <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedUsers.map((user) => {
                                    const RoleIcon = getRoleIcon(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    <RoleIcon className="w-3.5 h-3.5" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {user.walletBalance !== undefined ? (
                                                    <span className="font-medium text-gray-800">
                                                        {formatCurrency(user.walletBalance)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id)}
                                                            className={`p-2 rounded-lg ${user.status === 'active'
                                                                    ? 'hover:bg-red-50 text-red-500 hover:text-red-700'
                                                                    : 'hover:bg-emerald-50 text-emerald-500 hover:text-emerald-700'
                                                                }`}
                                                            title={user.status === 'active' ? 'Suspend' : 'Activate'}
                                                        >
                                                            {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* User Details Modal */}
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedUser(null);
                    }}
                    title="User Details"
                    size="large"
                >
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* User header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                    {getInitials(selectedUser.name)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                                            {selectedUser.role}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">User ID</p>
                                    <p className="font-medium text-gray-800">{selectedUser.id}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-800">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                {selectedUser.walletBalance !== undefined && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm text-gray-500">Wallet Balance</p>
                                        <p className="font-bold text-emerald-600">{formatCurrency(selectedUser.walletBalance)}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">Created</p>
                                    <p className="font-medium text-gray-800">{formatDate(selectedUser.createdAt)}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedUser.role !== 'admin' && (
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    {selectedUser.walletBalance !== undefined && (
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                setShowAddFundsModal(true);
                                            }}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            Add Funds
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleToggleStatus(selectedUser.id);
                                        }}
                                        className={selectedUser.status === 'active' ? 'btn-danger' : 'btn-success'}
                                    >
                                        {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Add Funds Modal */}
                <Modal
                    isOpen={showAddFundsModal}
                    onClose={() => {
                        setShowAddFundsModal(false);
                        setFundsAmount('');
                    }}
                    title="Add Funds"
                    size="small"
                >
                    {selectedUser && (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Add funds to <strong>{selectedUser.name}</strong>'s wallet
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                                    <input
                                        type="number"
                                        value={fundsAmount}
                                        onChange={(e) => setFundsAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="input-field pl-10"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddFunds}
                                disabled={!fundsAmount || parseFloat(fundsAmount) <= 0}
                                className="w-full btn-primary disabled:opacity-50"
                            >
                                Add Funds
                            </button>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default UserManagement;
