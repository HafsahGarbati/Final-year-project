import {
    ArrowUpRight,
    ArrowDownLeft,
    ShoppingBag,
    RefreshCw,
    Wallet,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getRelativeTime, getStatusColor } from '../../utils/helpers';

const TransactionCard = ({ transaction, currentUserId, onClick }) => {
    const isCredit = transaction.receiverId === currentUserId;
    const isDebit = transaction.senderId === currentUserId;
    const isDeposit = transaction.type === 'deposit';

    // Determine icon and color
    const getIcon = () => {
        if (isDeposit) return <Wallet className="w-5 h-5" />;
        if (transaction.type === 'payment') return <ShoppingBag className="w-5 h-5" />;
        if (transaction.type === 'refund') return <RefreshCw className="w-5 h-5" />;
        return isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />;
    };

    const getIconBgColor = () => {
        if (isDeposit) return 'bg-purple-100 text-purple-600';
        if (isCredit) return 'bg-emerald-100 text-emerald-600';
        return 'bg-red-100 text-red-600';
    };

    const getStatusIcon = () => {
        switch (transaction.status) {
            case 'completed':
                return <CheckCircle className="w-3 h-3 text-emerald-500" />;
            case 'pending':
                return <Clock className="w-3 h-3 text-amber-500" />;
            case 'failed':
                return <XCircle className="w-3 h-3 text-red-500" />;
            default:
                return null;
        }
    };

    // Get the other party's name
    const getOtherPartyName = () => {
        if (isDeposit) return 'Wallet Top-up';
        if (isCredit) return transaction.senderName;
        return transaction.receiverName;
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
        >
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgColor()}`}>
                    {getIcon()}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800 truncate">
                            {getOtherPartyName()}
                        </h3>
                        {getStatusIcon()}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{transaction.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{getRelativeTime(transaction.timestamp)}</p>
                </div>

                {/* Amount */}
                <div className="text-right">
                    <p className={`font-bold ${isCredit || isDeposit ? 'text-emerald-600' : 'text-gray-800'}`}>
                        {isCredit || isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Mini version for compact lists
export const TransactionCardMini = ({ transaction, currentUserId }) => {
    const isCredit = transaction.receiverId === currentUserId;
    const isDeposit = transaction.type === 'deposit';

    const getOtherPartyName = () => {
        if (isDeposit) return 'Top-up';
        if (isCredit) return transaction.senderName;
        return transaction.receiverName;
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCredit || isDeposit ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                    {isCredit || isDeposit ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    ) : (
                        <ArrowUpRight className="w-4 h-4 text-gray-600" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">{getOtherPartyName()}</p>
                    <p className="text-xs text-gray-400">{getRelativeTime(transaction.timestamp)}</p>
                </div>
            </div>
            <p className={`font-semibold ${isCredit || isDeposit ? 'text-emerald-600' : 'text-gray-700'}`}>
                {isCredit || isDeposit ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
        </div>
    );
};

export default TransactionCard;
