import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Eye, EyeOff, Loader2, User, Store, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [activeTab, setActiveTab] = useState('student');
    const [userId, setUserId] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState('');

    const demoCredentials = {
        student: [
            { id: 'STU001', name: 'John Doe' },
            { id: 'STU002', name: 'Sarah Johnson' },
        ],
        merchant: [
            { id: 'MER001', name: 'Campus Cafeteria' },
            { id: 'MER002', name: 'Campus Bookstore' },
        ],
        admin: [
            { id: 'ADM001', name: 'System Admin' },
        ],
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId || !pin) {
            setError('Please enter your ID and PIN');
            return;
        }

        const result = await login(userId, pin);

        if (result.success) {
            const redirectPath = {
                student: '/student/dashboard',
                merchant: '/merchant/dashboard',
                admin: '/admin/dashboard',
            };
            navigate(redirectPath[result.user.role] || '/');
        } else {
            setError(result.error);
        }
    };

    const fillDemoCredentials = (id) => {
        setUserId(id);
        setPin('1234');
        setError('');
    };

    const tabIcons = {
        student: User,
        merchant: Store,
        admin: Shield,
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/Logo.png" alt="BUK Pay" className="h-16 w-16 rounded-xl mb-4 object-contain" />
                    <h1 className="text-2xl font-bold">BUK Pay</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                <Card>
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Choose your account type and enter your credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                {Object.entries(tabIcons).map(([key, Icon]) => (
                                    <TabsTrigger key={key} value={key} className="capitalize gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{key}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {['student', 'merchant', 'admin'].map((role) => (
                                <TabsContent key={role} value={role}>
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="userId">
                                                {role === 'student' ? 'Student ID' : role === 'merchant' ? 'Merchant ID' : 'Admin ID'}
                                            </label>
                                            <Input
                                                id="userId"
                                                placeholder={`Enter your ${role} ID`}
                                                value={userId}
                                                onChange={(e) => setUserId(e.target.value.toUpperCase())}
                                                className="uppercase"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium" htmlFor="pin">
                                                PIN
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="pin"
                                                    type={showPin ? 'text' : 'password'}
                                                    placeholder="Enter 4-digit PIN"
                                                    value={pin}
                                                    onChange={(e) => setPin(e.target.value)}
                                                    maxLength={4}
                                                    className="pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowPin(!showPin)}
                                                >
                                                    {showPin ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </Button>

                                        {/* Demo Credentials */}
                                        <div className="pt-4 border-t">
                                            <p className="text-sm text-muted-foreground text-center mb-3">
                                                Demo Credentials
                                            </p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {demoCredentials[role].map((cred) => (
                                                    <Button
                                                        key={cred.id}
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fillDemoCredentials(cred.id)}
                                                        className="text-xs"
                                                    >
                                                        {cred.id} ({cred.name})
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </form>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Demo PIN for all accounts: <code className="bg-muted px-1.5 py-0.5 rounded">1234</code>
                </p>
            </div>
        </div>
    );
};

export default Login;
