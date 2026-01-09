import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Modal from '../shared/Modal';
import { EmptyState } from '../shared/LoadingSpinner';
import { formatCurrency, formatDate, getRelativeTime } from '../../utils/helpers';

const TransactionHistory = () => {
    const { currentUser } = useAuth();
    const { getTransactionHistory } = useWallet();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const allTransactions = getTransactionHistory(currentUser?.id, 100);

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter(txn => {
            if (filterType === 'sent' && txn.senderId !== currentUser?.id) return false;
            if (filterType === 'received' && txn.receiverId !== currentUser?.id) return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesDescription = txn.description?.toLowerCase().includes(query);
                const matchesSender = txn.senderName?.toLowerCase().includes(query);
                const matchesReceiver = txn.receiverName?.toLowerCase().includes(query);
                const matchesRef = txn.ref?.toLowerCase().includes(query);
                if (!matchesDescription && !matchesSender && !matchesReceiver && !matchesRef) return false;
            }
            return true;
        });
    }, [allTransactions, filterType, searchQuery, currentUser]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totals = useMemo(() => {
        const sent = filteredTransactions
            .filter(txn => txn.senderId === currentUser?.id)
            .reduce((sum, txn) => sum + txn.amount, 0);
        const received = filteredTransactions
            .filter(txn => txn.receiverId === currentUser?.id)
            .reduce((sum, txn) => sum + txn.amount, 0);
        return { sent, received };
    }, [filteredTransactions, currentUser]);

    const filterButtons = [
        { id: 'all', label: 'All' },
        { id: 'sent', label: 'Sent' },
        { id: 'received', label: 'Received' },
    ];

    return (
        <div className="py-6 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">Transaction History</h1>
                <p className="text-sm text-muted-foreground">{filteredTransactions.length} transactions found</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card>
                    <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Total Sent</p>
                                <p className="text-base sm:text-lg font-bold truncate">{formatCurrency(totals.sent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Total Received</p>
                                <p className="text-base sm:text-lg font-bold truncate">{formatCurrency(totals.received)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4 pb-4 space-y-3 sm:space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search transactions..."
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        {filterButtons.map((btn) => (
                            <Button
                                key={btn.id}
                                variant={filterType === btn.id ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1 text-xs sm:text-sm"
                                onClick={() => {
                                    setFilterType(btn.id);
                                    setCurrentPage(1);
                                }}
                            >
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Transactions List */}
            {paginatedTransactions.length > 0 ? (
                <Card>
                    <CardContent className="p-0 divide-y">
                        {paginatedTransactions.map((txn) => {
                            const isCredit = txn.receiverId === currentUser?.id;
                            return (
                                <button
                                    key={txn.id}
                                    onClick={() => setSelectedTransaction(txn)}
                                    className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {isCredit ? <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {isCredit ? txn.senderName : txn.receiverName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{getRelativeTime(txn.timestamp)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-sm font-medium ${isCredit ? 'text-green-600' : ''}`}>
                                            {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                                        </p>
                                        <Badge variant="secondary" className="text-[10px] sm:text-xs">{txn.status}</Badge>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="pt-6 pb-6">
                        <EmptyState
                            icon={Search}
                            title="No transactions found"
                            description={searchQuery ? "Try adjusting your search" : "Your transactions will appear here"}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
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
                            <p className={`text-2xl sm:text-3xl font-bold ${selectedTransaction.receiverId === currentUser?.id ? 'text-green-600' : ''
                                }`}>
                                {selectedTransaction.receiverId === currentUser?.id ? '+' : '-'}
                                {formatCurrency(selectedTransaction.amount)}
                            </p>
                            <p className="text-muted-foreground text-sm mt-1">{selectedTransaction.description}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="secondary">{selectedTransaction.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span className="capitalize">{selectedTransaction.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">From</span>
                                <span>{selectedTransaction.senderName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">To</span>
                                <span>{selectedTransaction.receiverName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span>{formatDate(selectedTransaction.timestamp)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reference</span>
                                <span className="font-mono text-xs">{selectedTransaction.ref}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TransactionHistory;
