import { useState, useMemo } from 'react';
import { useWallet } from '../../context/WalletContext';
import {
    Search,
    Filter,
    Activity,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import TransactionCard from '../shared/TransactionCard';
import Modal from '../shared/Modal';
import { EmptyState } from '../shared/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';

const TransactionMonitor = () => {
    const { getAllTransactions } = useWallet();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const allTransactions = getAllTransactions(500);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return allTransactions.filter(txn => {
            // Type filter
            if (filterType !== 'all' && txn.type !== filterType) return false;

            // Status filter
            if (filterStatus !== 'all' && txn.status !== filterStatus) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesRef = txn.ref?.toLowerCase().includes(query);
                const matchesSender = txn.senderName?.toLowerCase().includes(query);
                const matchesReceiver = txn.receiverName?.toLowerCase().includes(query);
                const matchesDesc = txn.description?.toLowerCase().includes(query);
                if (!matchesRef && !matchesSender && !matchesReceiver && !matchesDesc) return false;
            }

            return true;
        });
    }, [allTransactions, filterType, filterStatus, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate stats
    const stats = useMemo(() => {
        const total = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
        const completed = filteredTransactions.filter(t => t.status === 'completed').length;
        const pending = filteredTransactions.filter(t => t.status === 'pending').length;
        const failed = filteredTransactions.filter(t => t.status === 'failed').length;
        return { total, completed, pending, failed, count: filteredTransactions.length };
    }, [filteredTransactions]);

    const typeFilters = [
        { id: 'all', label: 'All Types' },
        { id: 'payment', label: 'Payments' },
        { id: 'transfer', label: 'Transfers' },
        { id: 'deposit', label: 'Deposits' },
    ];

    const statusFilters = [
        { id: 'all', label: 'All Status' },
        { id: 'completed', label: 'Completed' },
        { id: 'pending', label: 'Pending' },
        { id: 'failed', label: 'Failed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Transaction Monitor</h1>
                        <p className="text-gray-500">{stats.count} transactions</p>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Total Volume</p>
                        <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.total)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-xl font-bold text-emerald-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Failed</p>
                        <p className="text-xl font-bold text-red-600">{stats.failed}</p>
                    </div>
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
                            placeholder="Search by reference, sender, receiver..."
                            className="input-field pl-12"
                        />
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            {typeFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setFilterType(filter.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === filter.id
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

                {/* Transactions List */}
                {paginatedTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {paginatedTransactions.map((txn) => (
                            <TransactionCard
                                key={txn.id}
                                transaction={txn}
                                currentUserId={null}
                                onClick={() => setSelectedTransaction(txn)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Activity}
                        title="No transactions found"
                        description="Try adjusting your search or filters"
                    />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
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

                {/* Transaction Detail Modal */}
                <Modal
                    isOpen={!!selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    title="Transaction Details"
                >
                    {selectedTransaction && (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <p className="text-3xl font-bold text-gray-800">
                                    {formatCurrency(selectedTransaction.amount)}
                                </p>
                                <p className="text-gray-500 mt-1">{selectedTransaction.description}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="font-mono text-sm text-gray-800">{selectedTransaction.ref}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-medium text-emerald-600 capitalize">{selectedTransaction.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-medium text-gray-800 capitalize">{selectedTransaction.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">From</span>
                                    <span className="font-medium text-gray-800">{selectedTransaction.senderName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">To</span>
                                    <span className="font-medium text-gray-800">{selectedTransaction.receiverName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium text-gray-800">{formatDate(selectedTransaction.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default TransactionMonitor;
