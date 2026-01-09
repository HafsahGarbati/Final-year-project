import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((type, message, duration = 4000) => {
        const id = Date.now();
        const notification = { id, type, message };

        setNotifications((prev) => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, removeNotification, notifications }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = ({ notifications, onRemove }) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => onRemove(notification.id)}
                />
            ))}
        </div>
    );
};

const NotificationItem = ({ notification, onRemove }) => {
    const { type, message } = notification;

    const config = {
        success: {
            icon: CheckCircle2,
            bg: 'bg-green-600',
            text: 'text-white'
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-600',
            text: 'text-white'
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-500',
            text: 'text-white'
        },
        info: {
            icon: Info,
            bg: 'bg-blue-600',
            text: 'text-white'
        },
    };

    const { icon: Icon, bg, text } = config[type] || config.info;

    return (
        <div
            className={`${bg} ${text} p-4 rounded-lg shadow-lg flex items-start gap-3 min-w-72 animate-in slide-in-from-right duration-300`}
            role="alert"
        >
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onRemove}
                className="hover:opacity-70 transition-opacity"
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default NotificationContext;
