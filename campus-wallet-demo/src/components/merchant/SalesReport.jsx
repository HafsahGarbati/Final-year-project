import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    Calendar,
    TrendingUp,
    DollarSign,
    Users,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import TransactionCard from '../shared/TransactionCard';
import { EmptyState } from '../shared/LoadingSpinner';
import { formatCurrency, formatDateShort } from '../../utils/helpers';

const SalesReport = () => {
    const { currentUser } = useAuth();
    const { getMerchantSales, getTransactionHistory } = useWallet();

    const [dateRange, setDateRange] = useState('today'); // today, week, month
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate date ranges
    const getDateRange = (range) => {
        const now = new Date();
        let start, end = now;

        switch (range) {
            case 'today':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                start = new Date(now);
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        return { start, end };
    };

    const { start, end } = getDateRange(dateRange);
    const salesData = getMerchantSales(currentUser?.id, start, end);

    // Get unique customers
    const uniqueCustomers = useMemo(() => {
        const customerIds = new Set(salesData.transactions.map(t => t.senderId));
        return customerIds.size;
    }, [salesData.transactions]);

    // Average transaction
    const avgTransaction = salesData.count > 0
        ? salesData.total / salesData.count
        : 0;

    // Commission (simulated)
    const commission = salesData.total * (currentUser?.commissionRate || 1.5) / 100;
    const netRevenue = salesData.total - commission;

    // Pagination
    const totalPages = Math.ceil(salesData.transactions.length / itemsPerPage);
    const paginatedTransactions = salesData.transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const dateRangeButtons = [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
    ];

    // Stats cards
    const stats = [
        {
            label: 'Total Sales',
            value: formatCurrency(salesData.total),
            icon: DollarSign,
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            label: 'Transactions',
            value: salesData.count,
            icon: TrendingUp,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            label: 'Unique Customers',
            value: uniqueCustomers,
            icon: Users,
            color: 'bg-purple-100 text-purple-600'
        },
        {
            label: 'Avg. Transaction',
            value: formatCurrency(avgTransaction),
            icon: DollarSign,
            color: 'bg-amber-100 text-amber-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
                        <p className="text-gray-500">{currentUser?.name}</p>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">Date Range</span>
                    </div>
                    <div className="flex gap-2">
                        {dateRangeButtons.map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => {
                                    setDateRange(btn.id);
                                    setCurrentPage(1);
                                }}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${dateRange === btn.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100">
                            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Gross Sales</span>
                            <span className="font-medium text-gray-800">{formatCurrency(salesData.total)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Platform Fee ({currentUser?.commissionRate || 1.5}%)</span>
                            <span className="font-medium text-red-600">-{formatCurrency(commission)}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-gray-100">
                            <span className="font-semibold text-gray-800">Net Revenue</span>
                            <span className="text-xl font-bold text-emerald-600">{formatCurrency(netRevenue)}</span>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-xl border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Transaction Details</h3>
                        <p className="text-sm text-gray-500">{salesData.count} transactions</p>
                    </div>

                    <div className="p-4">
                        {paginatedTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {paginatedTransactions.map((txn) => (
                                    <TransactionCard
                                        key={txn.id}
                                        transaction={txn}
                                        currentUserId={currentUser?.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={DollarSign}
                                title="No transactions"
                                description="No sales recorded for this period"
                            />
                        )}
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
            </div>
        </div>
    );
};

export default SalesReport;
