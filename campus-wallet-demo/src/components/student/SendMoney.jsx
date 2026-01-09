import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import {
    Send,
    ArrowLeft,
    Loader2,
    Search,
    CheckCircle2,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, validateAmount, getInitials } from '../../utils/helpers';

const SendMoney = () => {
    const navigate = useNavigate();
    const { currentUser, getAllUsers, getUserById } = useAuth();
    const { sendMoney, loading } = useWallet();

    const [step, setStep] = useState(1);
    const [recipient, setRecipient] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [transaction, setTransaction] = useState(null);

    const recipients = getAllUsers().filter(user =>
        user.id !== currentUser?.id &&
        (user.role === 'student' || user.role === 'merchant') &&
        user.status === 'active'
    );

    const filteredRecipients = recipients.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectRecipient = (user) => {
        setRecipient(user);
        setStep(2);
        setError('');
    };

    const handleAmountContinue = () => {
        const validation = validateAmount(
            parseFloat(amount),
            currentUser?.walletBalance || 0,
            currentUser?.dailyLimit,
            currentUser?.dailySpent || 0
        );

        if (!validation.valid) {
            setError(validation.error);
            return;
        }
        setError('');
        setStep(3);
    };

    const handleSend = async () => {
        setError('');
        const result = await sendMoney(recipient.id, parseFloat(amount), description);

        if (result.success) {
            setTransaction(result.transaction);
            setStep(4);
        } else {
            setError(result.error);
        }
    };

    const quickAmounts = [500, 1000, 2000, 5000];

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate('/student/dashboard')}
                >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold">Send Money</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {step === 1 && 'Select a recipient'}
                        {step === 2 && 'Enter amount'}
                        {step === 3 && 'Confirm transfer'}
                        {step === 4 && 'Transfer complete'}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-secondary'}`}
                    />
                ))}
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
            )}

            {/* Step 1: Select Recipient */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or ID..."
                            className="pl-10"
                        />
                    </div>

                    <Card>
                        <CardContent className="p-0 divide-y max-h-80 sm:max-h-96 overflow-y-auto">
                            {filteredRecipients.length > 0 ? (
                                filteredRecipients.slice(0, 8).map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleSelectRecipient(user)}
                                        className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-muted/50 transition-colors text-left"
                                    >
                                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                                            <p className="text-xs sm:text-sm text-muted-foreground">{user.id}</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs capitalize">{user.role}</Badge>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">No users found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && recipient && (
                <div className="space-y-5 sm:space-y-6">
                    <Card>
                        <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 flex items-center gap-3 sm:gap-4">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(recipient.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm sm:text-base">{recipient.name}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{recipient.id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-muted-foreground">₦</span>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="text-xl sm:text-2xl font-bold pl-10 h-12 sm:h-14 text-center"
                            />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Balance: {formatCurrency(currentUser?.walletBalance || 0)}
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map((amt) => (
                            <Button
                                key={amt}
                                variant={amount === amt.toString() ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs sm:text-sm"
                                onClick={() => setAmount(amt.toString())}
                            >
                                ₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Note (optional)</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this for?"
                        />
                    </div>

                    <Button
                        onClick={handleAmountContinue}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="w-full h-11 sm:h-12"
                    >
                        Continue
                    </Button>
                </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && recipient && (
                <div className="space-y-5 sm:space-y-6">
                    <Card>
                        <CardHeader className="text-center pb-2">
                            <CardDescription>You are sending</CardDescription>
                            <CardTitle className="text-3xl sm:text-4xl">{formatCurrency(parseFloat(amount))}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            <Separator />
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">To</span>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                        <AvatarFallback className="text-[10px] sm:text-xs">{getInitials(recipient.name)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{recipient.name}</span>
                                </div>
                            </div>
                            {description && (
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-muted-foreground">Note</span>
                                    <span className="text-right max-w-[60%] truncate">{description}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Fee</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-base sm:text-lg">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">{formatCurrency(parseFloat(amount))}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={handleSend} disabled={loading} className="w-full h-11 sm:h-12">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Confirm & Send
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && transaction && (
                <Card className="text-center">
                    <CardContent className="pt-8 pb-8 space-y-5 sm:space-y-6">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">{formatCurrency(transaction.amount)}</p>
                            <p className="text-muted-foreground text-sm sm:text-base">sent to {transaction.receiverName}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-muted-foreground">Reference</p>
                            <p className="font-mono font-medium text-sm sm:text-base">{transaction.ref}</p>
                        </div>
                        <div className="space-y-2">
                            <Button onClick={() => navigate('/student/history')} variant="outline" className="w-full">
                                View Transaction
                            </Button>
                            <Button onClick={() => navigate('/student/dashboard')} className="w-full">
                                Done
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SendMoney;
