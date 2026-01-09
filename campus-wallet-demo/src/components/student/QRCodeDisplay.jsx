import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    QrCode,
    Copy,
    Check,
    RefreshCw,
    Clock,
    Share2
} from 'lucide-react';
import { formatCurrency, getInitials } from '../../utils/helpers';

const QRCodeDisplay = () => {
    const { currentUser } = useAuth();
    const [amount, setAmount] = useState('');
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [qrKey, setQrKey] = useState(Date.now());

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Auto regenerate QR code
                    setQrKey(Date.now());
                    return 300;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(currentUser?.id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = () => {
        setQrKey(Date.now());
        setTimeLeft(300);
    };

    // Generate a simple visual QR pattern (simulated)
    const generateQRPattern = () => {
        const size = 11;
        const pattern = [];

        // Create a deterministic pattern based on user ID
        const seed = currentUser?.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;

        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                // Corner patterns (finder patterns)
                const isCorner =
                    (i < 3 && j < 3) ||
                    (i < 3 && j >= size - 3) ||
                    (i >= size - 3 && j < 3);

                if (isCorner) {
                    const isOuter = i === 0 || i === 2 || j === 0 || j === 2 ||
                        i === size - 1 || i === size - 3 ||
                        j === size - 1 || j === size - 3;
                    const isCenter = (i === 1 && j === 1) ||
                        (i === 1 && j === size - 2) ||
                        (i === size - 2 && j === 1);
                    row.push(isOuter || isCenter);
                } else {
                    // Random-ish pattern for the rest
                    row.push((seed + i * j + qrKey) % 3 !== 0);
                }
            }
            pattern.push(row);
        }
        return pattern;
    };

    const qrPattern = generateQRPattern();

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Receive Payment</h1>
                    <p className="text-gray-500">Show this QR code to receive money</p>
                </div>

                {/* QR Code Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    {/* User Info */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {getInitials(currentUser?.name || '')}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{currentUser?.name}</p>
                            <p className="text-sm text-gray-500">{currentUser?.id}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
                            <div
                                className="grid gap-1"
                                style={{
                                    gridTemplateColumns: `repeat(${qrPattern[0]?.length || 11}, 1fr)`
                                }}
                            >
                                {qrPattern.flat().map((filled, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-sm ${filled ? 'bg-gray-900' : 'bg-white'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Expires in {formatTime(timeLeft)}</span>
                    </div>

                    {/* Amount Input (Optional) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request specific amount (optional)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="input-field pl-10 text-center"
                            />
                        </div>
                        {amount && (
                            <p className="text-center text-sm text-emerald-600 mt-2">
                                Requesting {formatCurrency(parseFloat(amount) || 0)}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyId}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy ID
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRegenerate}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-medium text-blue-800 mb-2">How to receive payment</h3>
                    <ol className="text-sm text-blue-700 space-y-2">
                        <li className="flex gap-2">
                            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                            Show this QR code to the sender
                        </li>
                        <li className="flex gap-2">
                            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                            They scan it with their BUK Pay app
                        </li>
                        <li className="flex gap-2">
                            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                            Receive money instantly to your wallet
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
