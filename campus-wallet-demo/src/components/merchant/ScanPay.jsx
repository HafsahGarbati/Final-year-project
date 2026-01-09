import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    Camera,
    User,
    DollarSign,
    FileText,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    X
} from 'lucide-react';
import { formatCurrency, getInitials } from '../../utils/helpers';
import { SuccessAnimation } from '../shared/LoadingSpinner';

const ScanPay = () => {
    const navigate = useNavigate();
    const { getUserById, currentUser } = useAuth();
    const { processPayment, loading } = useWallet();

    const [step, setStep] = useState(1); // 1: Scan/Enter ID, 2: Enter amount, 3: Confirm, 4: Success
    const [studentId, setStudentId] = useState('');
    const [student, setStudent] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [transaction, setTransaction] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // Simulate QR scan
    const handleScan = () => {
        setIsScanning(true);
        setError('');

        // Simulate scanning delay
        setTimeout(() => {
            // Randomly pick a student for demo
            const demoStudents = ['STU001', 'STU002', 'STU003', 'STU004'];
            const randomStudent = demoStudents[Math.floor(Math.random() * demoStudents.length)];
            setStudentId(randomStudent);
            handleLookup(randomStudent);
            setIsScanning(false);
        }, 1500);
    };

    // Look up student by ID
    const handleLookup = (id = studentId) => {
        setError('');
        const user = getUserById(id.toUpperCase());

        if (!user) {
            setError('Student not found');
            return;
        }
        if (user.role !== 'student') {
            setError('Invalid student ID');
            return;
        }
        if (user.status === 'suspended') {
            setError('This student account is suspended');
            return;
        }

        setStudent(user);
        setStep(2);
    };

    // Handle amount entry
    const handleAmountContinue = () => {
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (numAmount < 10) {
            setError('Minimum amount is ₦10');
            return;
        }
        if (numAmount > (student?.walletBalance || 0)) {
            setError('Student has insufficient balance');
            return;
        }

        setError('');
        setStep(3);
    };

    // Process payment
    const handlePayment = async () => {
        setError('');
        const result = await processPayment(student.id, parseFloat(amount), description || `Payment at ${currentUser?.name}`);

        if (result.success) {
            setTransaction(result.transaction);
            setStep(4);
        } else {
            setError(result.error);
        }
    };

    // Reset and start new transaction
    const handleNewTransaction = () => {
        setStep(1);
        setStudentId('');
        setStudent(null);
        setAmount('');
        setDescription('');
        setError('');
        setTransaction(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate('/merchant/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Accept Payment</h1>
                        <p className="text-sm text-gray-500">
                            {step === 1 && 'Scan QR code or enter student ID'}
                            {step === 2 && 'Enter payment amount'}
                            {step === 3 && 'Confirm payment'}
                            {step === 4 && 'Payment complete'}
                        </p>
                    </div>
                </div>

                {/* Error display */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-3 animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Step 1: Scan/Enter ID */}
                {step === 1 && (
                    <div className="space-y-6">
                        {/* Simulated Camera View */}
                        <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square">
                            {/* Camera frame decoration */}
                            <div className="absolute inset-8 border-2 border-white/50 rounded-xl">
                                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                            </div>

                            {/* Scan line animation */}
                            {isScanning && (
                                <div className="absolute inset-8">
                                    <div className="h-0.5 bg-emerald-400 animate-pulse" style={{
                                        animation: 'scan 2s ease-in-out infinite',
                                    }} />
                                </div>
                            )}

                            {/* Center content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {isScanning ? (
                                    <div className="text-center">
                                        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                                        <p className="text-white font-medium">Scanning...</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Camera className="w-12 h-12 text-white/50 mx-auto mb-4" />
                                        <p className="text-white/70">Position QR code here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scan Button */}
                        <button
                            onClick={handleScan}
                            disabled={isScanning}
                            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-5 h-5" />
                                    Simulate Scan
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-sm text-gray-500">or enter manually</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Manual Entry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student ID
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                                    placeholder="e.g., STU001"
                                    className="input-field flex-1 uppercase"
                                />
                                <button
                                    onClick={() => handleLookup()}
                                    disabled={!studentId}
                                    className="btn-secondary px-6"
                                >
                                    Look Up
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Enter Amount */}
                {step === 2 && student && (
                    <div className="space-y-6">
                        {/* Student Info */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                {getInitials(student.name)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{student.name}</p>
                                <p className="text-sm text-gray-500">{student.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Available</p>
                                <p className="font-bold text-emerald-600">{formatCurrency(student.walletBalance)}</p>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount to Charge
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-gray-400">₦</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="input-field text-4xl font-bold pl-14 py-6 text-center"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (optional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., Lunch - Rice and Chicken"
                                className="input-field"
                            />
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleAmountContinue}
                            disabled={!amount || parseFloat(amount) <= 0}
                            className="w-full btn-success py-4 text-lg"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && student && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="text-center text-gray-500 mb-4">Charging</h3>
                            <p className="text-5xl font-bold text-center text-gray-800 mb-6">
                                {formatCurrency(parseFloat(amount))}
                            </p>

                            <div className="border-t border-gray-100 pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">From</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                            {getInitials(student.name)}
                                        </div>
                                        <span className="font-medium text-gray-800">{student.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Student ID</span>
                                    <span className="font-medium text-gray-800">{student.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Student Balance</span>
                                    <span className="font-medium text-emerald-600">{formatCurrency(student.walletBalance)}</span>
                                </div>
                                {description && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Description</span>
                                        <span className="font-medium text-gray-800">{description}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="font-medium text-gray-700">Amount Due</span>
                                    <span className="text-2xl font-bold text-gray-800">
                                        {formatCurrency(parseFloat(amount))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full btn-success py-4 text-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Confirm Payment
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && transaction && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <SuccessAnimation message="Payment Received!" />

                        <div className="text-center mb-6">
                            <p className="text-4xl font-bold text-emerald-600 mb-2">
                                +{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-gray-500">
                                from {transaction.senderName}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
                                <p className="font-mono font-medium text-gray-800">{transaction.ref}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleNewTransaction}
                                className="w-full btn-success py-3"
                            >
                                New Transaction
                            </button>
                            <button
                                onClick={() => navigate('/merchant/dashboard')}
                                className="w-full btn-secondary py-3"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(200px); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default ScanPay;
