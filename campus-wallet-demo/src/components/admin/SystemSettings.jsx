import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { useNotification } from '../../context/NotificationContext';
import {
    Settings,
    DollarSign,
    Shield,
    Database,
    Download,
    Upload,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';
import { ConfirmModal } from '../shared/Modal';
import { exportData, importData, clearAllStorage } from '../../utils/localStorage';
import { formatCurrency } from '../../utils/helpers';

const SystemSettings = () => {
    const { resetData } = useAuth();
    const { resetTransactions } = useWallet();
    const { showNotification } = useNotification();

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // System settings (simulated)
    const [settings, setSettings] = useState({
        minTransaction: 10,
        maxTransaction: 50000,
        defaultDailyLimit: 50000,
        merchantCommission: 1.5,
        maintenanceMode: false,
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        showNotification('success', 'Setting updated');
    };

    const handleExportData = () => {
        exportData();
        showNotification('success', 'Data exported successfully');
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = importData(event.target.result);
                    if (result.success) {
                        showNotification('success', 'Data imported successfully. Refresh the page to see changes.');
                    } else {
                        showNotification('error', result.error || 'Import failed');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleResetData = () => {
        resetData();
        resetTransactions();
        setShowResetConfirm(false);
        showNotification('success', 'Data reset to defaults');
    };

    const settingSections = [
        {
            title: 'Transaction Limits',
            icon: DollarSign,
            settings: [
                {
                    key: 'minTransaction',
                    label: 'Minimum Transaction',
                    type: 'currency',
                    value: settings.minTransaction,
                },
                {
                    key: 'maxTransaction',
                    label: 'Maximum Transaction',
                    type: 'currency',
                    value: settings.maxTransaction,
                },
                {
                    key: 'defaultDailyLimit',
                    label: 'Default Daily Limit',
                    type: 'currency',
                    value: settings.defaultDailyLimit,
                },
            ],
        },
        {
            title: 'Merchant Settings',
            icon: Shield,
            settings: [
                {
                    key: 'merchantCommission',
                    label: 'Platform Commission Rate',
                    type: 'percentage',
                    value: settings.merchantCommission,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                    <p className="text-gray-500">Configure platform settings</p>
                </div>

                {/* Settings Sections */}
                {settingSections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-100 mb-6">
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <section.icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="font-semibold text-gray-800">{section.title}</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {section.settings.map((setting) => (
                                <div key={setting.key} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{setting.label}</p>
                                        <p className="text-sm text-gray-500">
                                            {setting.type === 'currency' && formatCurrency(setting.value)}
                                            {setting.type === 'percentage' && `${setting.value}%`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={setting.value}
                                            onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value))}
                                            className="w-32 input-field text-right"
                                            step={setting.type === 'percentage' ? 0.1 : 100}
                                        />
                                        <span className="text-gray-500">
                                            {setting.type === 'currency' ? '₦' : '%'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Data Management */}
                <div className="bg-white rounded-xl border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="font-semibold text-gray-800">Data Management</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Export Data</p>
                                <p className="text-sm text-gray-500">Download all data as JSON backup</p>
                            </div>
                            <button
                                onClick={handleExportData}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Import Data</p>
                                <p className="text-sm text-gray-500">Restore from JSON backup</p>
                            </div>
                            <button
                                onClick={handleImportData}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Import
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200">
                    <div className="flex items-center gap-3 p-4 border-b border-red-100 bg-red-50 rounded-t-xl">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="font-semibold text-red-800">Danger Zone</h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Reset All Data</p>
                                <p className="text-sm text-gray-500">Reset to initial demo data</p>
                            </div>
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="btn-danger flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reset Confirmation Modal */}
                <ConfirmModal
                    isOpen={showResetConfirm}
                    onClose={() => setShowResetConfirm(false)}
                    onConfirm={handleResetData}
                    title="Reset All Data"
                    message="This will reset all users, transactions, and settings to the initial demo state. This action cannot be undone."
                    confirmText="Reset Everything"
                    confirmVariant="danger"
                />
            </div>
        </div>
    );
};

export default SystemSettings;
