import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    Send,
    Download,
    QrCode,
    Clock,
    TrendingUp,
    ArrowRight,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getGreeting, getRelativeTime } from '../../utils/helpers';

const StudentDashboard = () => {
    const { currentUser } = useAuth();
    const { getRecentTransactions, getBalance } = useWallet();

    const recentTransactions = getRecentTransactions(5);
    const balance = getBalance();

    const dailySpent = currentUser?.dailySpent || 0;
    const dailyLimit = currentUser?.dailyLimit || 50000;
    const dailyProgress = (dailySpent / dailyLimit) * 100;

    const quickActions = [
        { label: 'Send Money', icon: Send, path: '/student/send', variant: 'default' },
        { label: 'Load Funds', icon: Download, path: '/student/load', variant: 'secondary' },
        { label: 'Show QR', icon: QrCode, path: '/student/qr', variant: 'secondary' },
        { label: 'History', icon: Clock, path: '/student/history', variant: 'secondary' },
    ];

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="text-center sm:text-left">
                <p className="text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-2xl sm:text-3xl font-bold">{currentUser?.name}</h1>
            </div>

            {/* Balance Card */}
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left">
                        <div>
                            <p className="text-primary-foreground/70 text-sm">Available Balance</p>
                            <p className="text-3xl sm:text-4xl font-bold mt-1">{formatCurrency(balance)}</p>
                        </div>
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                            <Wallet className="h-7 w-7 sm:h-8 sm:w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Limit */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Daily Spending Limit</span>
                        <span className="text-sm font-medium">
                            {formatCurrency(dailySpent)} / {formatCurrency(dailyLimit)}
                        </span>
                    </div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${dailyProgress > 80 ? 'bg-destructive' : dailyProgress > 50 ? 'bg-yellow-500' : 'bg-primary'
                                }`}
                            style={{ width: `${Math.min(dailyProgress, 100)}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.label} to={action.path} className="block">
                        <Button
                            variant={action.variant}
                            className="w-full h-auto py-5 sm:py-6 flex-col gap-2"
                        >
                            <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-xs sm:text-sm">{action.label}</span>
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
                        <Link to="/student/history">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs sm:text-sm">
                                View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {recentTransactions.map((txn) => {
                                const isCredit = txn.receiverId === currentUser?.id;
                                return (
                                    <div key={txn.id} className="flex items-center gap-3 sm:gap-4">
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
                                            <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                                {txn.status}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                <Wallet className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">No transactions yet</p>
                            <Link to="/student/send">
                                <Button variant="link" size="sm">Make your first transaction</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card>
                    <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Received This Month</p>
                                <p className="text-base sm:text-lg font-bold truncate">{formatCurrency(18500)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Spent This Month</p>
                                <p className="text-base sm:text-lg font-bold truncate">{formatCurrency(12300)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
