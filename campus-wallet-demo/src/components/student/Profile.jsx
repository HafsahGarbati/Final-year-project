import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
    User,
    Mail,
    Phone,
    Shield,
    CreditCard,
    Clock,
    ChevronRight,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';
import Modal from '../shared/Modal';
import { formatCurrency, formatDate, getInitials } from '../../utils/helpers';

const Profile = () => {
    const { currentUser, changePin } = useAuth();
    const { showNotification } = useNotification();

    const [showPinModal, setShowPinModal] = useState(false);
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showPins, setShowPins] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pinError, setPinError] = useState('');

    const handleChangePin = async () => {
        setPinError('');

        if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
            setPinError('PIN must be 4 digits');
            return;
        }

        if (newPin !== confirmPin) {
            setPinError('PINs do not match');
            return;
        }

        setLoading(true);
        const result = await changePin(currentUser?.id, currentPin, newPin);
        setLoading(false);

        if (result.success) {
            showNotification('success', 'PIN changed successfully');
            setShowPinModal(false);
            setCurrentPin('');
            setNewPin('');
            setConfirmPin('');
        } else {
            setPinError(result.error);
        }
    };

    const profileSections = [
        {
            title: 'Account Information',
            items: [
                { icon: User, label: 'Full Name', value: currentUser?.name },
                { icon: Mail, label: 'Email', value: currentUser?.email },
                { icon: Phone, label: 'Phone', value: currentUser?.phone },
                { icon: CreditCard, label: 'Student ID', value: currentUser?.id },
            ]
        },
        {
            title: 'Wallet Settings',
            items: [
                {
                    icon: CreditCard,
                    label: 'Daily Limit',
                    value: formatCurrency(currentUser?.dailyLimit || 50000),
                    subtext: `Spent today: ${formatCurrency(currentUser?.dailySpent || 0)}`
                },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                            {getInitials(currentUser?.name || '')}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
                            <p className="text-blue-100">{currentUser?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                                Student Account
                            </span>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${currentUser?.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-gray-800">Account Status</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentUser?.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {currentUser?.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                </div>

                {/* Profile Sections */}
                {profileSections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {section.title}
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                        <p className="font-medium text-gray-800">{item.value}</p>
                                        {item.subtext && (
                                            <p className="text-xs text-gray-400">{item.subtext}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Security Section */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Security
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-100">
                        <button
                            onClick={() => setShowPinModal(true)}
                            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-gray-800">Change PIN</p>
                                <p className="text-sm text-gray-500">Update your 4-digit PIN</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Account Created */}
                <div className="text-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Account created: {formatDate(currentUser?.createdAt)}
                </div>

                {/* Change PIN Modal */}
                <Modal
                    isOpen={showPinModal}
                    onClose={() => {
                        setShowPinModal(false);
                        setCurrentPin('');
                        setNewPin('');
                        setConfirmPin('');
                        setPinError('');
                    }}
                    title="Change PIN"
                >
                    <div className="space-y-4">
                        {pinError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {pinError}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current PIN
                            </label>
                            <div className="relative">
                                <input
                                    type={showPins ? 'text' : 'password'}
                                    value={currentPin}
                                    onChange={(e) => setCurrentPin(e.target.value)}
                                    placeholder="Enter current PIN"
                                    maxLength={4}
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPins(!showPins)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPins ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New PIN
                            </label>
                            <input
                                type={showPins ? 'text' : 'password'}
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                                placeholder="Enter new PIN"
                                maxLength={4}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New PIN
                            </label>
                            <input
                                type={showPins ? 'text' : 'password'}
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                                placeholder="Confirm new PIN"
                                maxLength={4}
                                className="input-field"
                            />
                        </div>

                        <button
                            onClick={handleChangePin}
                            disabled={loading || !currentPin || !newPin || !confirmPin}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Change PIN'
                            )}
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;
