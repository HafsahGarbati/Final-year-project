import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    ScanLine,
    TrendingUp,
    FileText,
    Clock,
    ArrowRight,
    DollarSign,
    ShoppingBag,
    Users,
    Wallet,
    ArrowDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getGreeting, getRelativeTime } from '../../utils/helpers';

const MerchantDashboard = () => {
    const { currentUser } = useAuth();
    const { getMerchantSales, getTransactionHistory } = useWallet();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaySales = getMerchantSales(currentUser?.id, todayStart, now);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const weekSales = getMerchantSales(currentUser?.id, weekStart, now);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSales = getMerchantSales(currentUser?.id, monthStart, now);

    const recentTransactions = getTransactionHistory(currentUser?.id, 5);

    const stats = [
        { label: "Today", value: formatCurrency(todaySales.total), subvalue: `${todaySales.count} txns`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Week', value: formatCurrency(weekSales.total), subvalue: `${weekSales.count} txns`, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
        { label: 'Month', value: formatCurrency(monthSales.total), subvalue: `${monthSales.count} txns`, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="py-6 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="text-center sm:text-left">
                <p className="text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentUser?.businessType} • {currentUser?.location}</p>
            </div>

            {/* Balance Card */}
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left">
                        <div>
                            <p className="text-primary-foreground/70 text-sm">Merchant Wallet</p>
                            <p className="text-3xl sm:text-4xl font-bold mt-1">{formatCurrency(currentUser?.walletBalance || 0)}</p>
                        </div>
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                            <Wallet className="h-7 w-7 sm:h-8 sm:w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link to="/merchant/scan" className="block">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 flex items-center gap-3 sm:gap-4">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <ScanLine className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm sm:text-base">Scan & Pay</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Accept payment</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/merchant/reports" className="block">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 flex items-center gap-3 sm:gap-4">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm sm:text-base">Reports</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">View analytics</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx}>
                        <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6 text-center">
                            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                            <p className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.subvalue}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base">Recent Transactions</CardTitle>
                        <Link to="/merchant/reports">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs sm:text-sm">
                                View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {recentTransactions.map((txn) => (
                                <div key={txn.id} className="flex items-center gap-3 sm:gap-4">
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{txn.senderName}</p>
                                        <p className="text-xs text-muted-foreground">{getRelativeTime(txn.timestamp)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-medium text-green-600">+{formatCurrency(txn.amount)}</p>
                                        <Badge variant="secondary" className="text-[10px] sm:text-xs">{txn.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">No transactions yet</p>
                            <Link to="/merchant/scan">
                                <Button variant="link" size="sm">Accept your first payment</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MerchantDashboard;
