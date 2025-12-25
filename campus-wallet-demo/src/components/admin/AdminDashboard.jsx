import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { getSystemStats } from '../../data/mockData';
import {
    Users,
    Store,
    Activity,
    DollarSign,
    ArrowRight,
    Shield,
    CheckCircle,
    AlertTriangle,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getGreeting, getRelativeTime } from '../../utils/helpers';

const AdminDashboard = () => {
    const { currentUser, getAllUsers } = useAuth();
    const { getAllTransactions } = useWallet();

    const users = getAllUsers();
    const transactions = getAllTransactions();
    const stats = getSystemStats(users, transactions);

    const recentTransactions = transactions.slice(0, 6);

    const statCards = [
        { label: 'Users', value: stats.totalUsers, subvalue: `${stats.totalStudents} students`, icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Today', value: stats.todayTransactions, subvalue: formatCurrency(stats.todayVolume), icon: Activity, color: 'bg-green-100 text-green-600' },
        { label: 'Active', value: stats.activeUsers, subvalue: `${stats.suspendedUsers} suspended`, icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
        { label: 'Balance', value: formatCurrency(stats.totalSystemBalance), subvalue: 'Total in system', icon: DollarSign, color: 'bg-amber-100 text-amber-600' },
    ];

    const quickActions = [
        { label: 'Users', icon: Users, path: '/admin/users' },
        { label: 'Transactions', icon: Activity, path: '/admin/transactions' },
        { label: 'Settings', icon: Shield, path: '/admin/settings' },
    ];

    return (
        <div className="py-6 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="text-center sm:text-left">
                <p className="text-muted-foreground">{getGreeting()}</p>
                <h1 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">System Administrator</p>
            </div>

            {/* System Status */}
            <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-green-800 text-sm sm:text-base">System: Operational</p>
                        <p className="text-xs sm:text-sm text-green-600">All services running</p>
                    </div>
                    <Badge variant="secondary" className="hidden sm:inline-flex">Live</Badge>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((stat, idx) => (
                    <Card key={idx}>
                        <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
                            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}>
                                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                            <p className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.subvalue}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {quickActions.map((action, idx) => (
                    <Link key={idx} to={action.path} className="block">
                        <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2">
                            <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-xs sm:text-sm">{action.label}</span>
                        </Button>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
                {/* Live Feed */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-sm sm:text-base">Live Feed</CardTitle>
                            </div>
                            <Link to="/admin/transactions">
                                <Button variant="ghost" size="sm" className="gap-1 text-xs sm:text-sm">
                                    All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="max-h-72 sm:max-h-80 overflow-y-auto">
                        <div className="space-y-2 sm:space-y-3">
                            {recentTransactions.map((txn) => (
                                <div key={txn.id} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-muted/50">
                                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-medium truncate">{txn.senderName} → {txn.receiverName}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">{getRelativeTime(txn.timestamp)}</p>
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium flex-shrink-0">{formatCurrency(txn.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* User Overview */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm sm:text-base">Users</CardTitle>
                            <Link to="/admin/users">
                                <Button variant="ghost" size="sm" className="gap-1 text-xs sm:text-sm">
                                    Manage <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                <span className="font-medium text-sm sm:text-base">Students</span>
                            </div>
                            <Badge variant="secondary">{stats.totalStudents}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Store className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                <span className="font-medium text-sm sm:text-base">Merchants</span>
                            </div>
                            <Badge variant="secondary">{stats.totalMerchants}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                <span className="font-medium text-sm sm:text-base">Active</span>
                            </div>
                            <Badge variant="secondary">{stats.activeUsers}</Badge>
                        </div>
                        {stats.suspendedUsers > 0 && (
                            <div className="flex items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                    <span className="font-medium text-sm sm:text-base">Suspended</span>
                                </div>
                                <Badge variant="destructive">{stats.suspendedUsers}</Badge>
                            </div>
                        )}
                        <div className="pt-3 sm:pt-4 text-center border-t">
                            <p className="text-2xl sm:text-3xl font-bold">{stats.totalTransactions}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Transactions</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
