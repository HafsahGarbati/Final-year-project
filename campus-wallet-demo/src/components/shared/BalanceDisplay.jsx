import { RefreshCw, Wallet, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const BalanceDisplay = ({
    balance,
    label = 'Wallet Balance',
    onRefresh,
    loading = false,
    showTrend = false,
    trend = 0,
    size = 'large'
}) => {
    if (size === 'small') {
        return (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">{label}</p>
                        <p className="text-2xl font-bold mt-1">
                            {loading ? (
                                <span className="inline-block w-24 h-7 bg-white/20 rounded animate-pulse" />
                            ) : (
                                formatCurrency(balance)
                            )}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-blue-200" />
                        <span className="text-blue-100 font-medium">{label}</span>
                    </div>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh balance"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Balance */}
                <div className="mb-4">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Updating...</span>
                        </div>
                    ) : (
                        <p className="text-4xl font-bold tracking-tight">
                            {formatCurrency(balance)}
                        </p>
                    )}
                </div>

                {/* Trend indicator */}
                {showTrend && !loading && (
                    <div className="flex items-center gap-2">
                        {trend >= 0 ? (
                            <>
                                <div className="flex items-center gap-1 text-emerald-300">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">+{formatCurrency(Math.abs(trend))}</span>
                                </div>
                                <span className="text-blue-200 text-sm">this week</span>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1 text-red-300">
                                    <TrendingDown className="w-4 h-4" />
                                    <span className="text-sm font-medium">-{formatCurrency(Math.abs(trend))}</span>
                                </div>
                                <span className="text-blue-200 text-sm">this week</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Skeleton version for loading states
export const BalanceDisplaySkeleton = ({ size = 'large' }) => {
    if (size === 'small') {
        return (
            <div className="bg-gray-200 rounded-xl p-4 animate-pulse">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="w-20 h-4 bg-gray-300 rounded mb-2" />
                        <div className="w-28 h-7 bg-gray-300 rounded" />
                    </div>
                    <div className="w-10 h-10 bg-gray-300 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-28 h-5 bg-gray-300 rounded" />
                <div className="w-8 h-8 bg-gray-300 rounded-lg" />
            </div>
            <div className="w-40 h-10 bg-gray-300 rounded mb-4" />
            <div className="w-32 h-4 bg-gray-300 rounded" />
        </div>
    );
};

export default BalanceDisplay;
