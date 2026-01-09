import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Wallet,
    Home,
    Send,
    Clock,
    QrCode,
    User,
    ScanLine,
    FileText,
    Users,
    Activity,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, getInitials } from '../../utils/helpers';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = {
        student: [
            { path: '/student/dashboard', label: 'Dashboard', icon: Home },
            { path: '/student/send', label: 'Send', icon: Send },
            { path: '/student/history', label: 'History', icon: Clock },
            { path: '/student/qr', label: 'QR', icon: QrCode },
            { path: '/student/profile', label: 'Profile', icon: User },
        ],
        merchant: [
            { path: '/merchant/dashboard', label: 'Dashboard', icon: Home },
            { path: '/merchant/scan', label: 'Scan', icon: ScanLine },
            { path: '/merchant/reports', label: 'Reports', icon: FileText },
        ],
        admin: [
            { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
            { path: '/admin/users', label: 'Users', icon: Users },
            { path: '/admin/transactions', label: 'Transactions', icon: Activity },
            { path: '/admin/settings', label: 'Settings', icon: Settings },
        ],
    };

    const links = navLinks[currentUser?.role] || [];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex h-14 items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mr-4 sm:mr-6 flex-shrink-0">
                    <img src="/Logo.png" alt="BUK Pay" className="h-7 w-7 sm:h-8 sm:w-8 rounded object-contain" />
                    <span className="font-semibold hidden sm:inline text-sm sm:text-base">BUK Pay</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-0.5 sm:gap-1 flex-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link key={link.path} to={link.path}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                                >
                                    <link.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="hidden lg:inline">{link.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    {/* Balance */}
                    {currentUser?.walletBalance !== undefined && (
                        <Badge variant="secondary" className="font-mono text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 hidden xs:inline-flex">
                            {formatCurrency(currentUser.walletBalance)}
                        </Badge>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] sm:text-xs">
                                {getInitials(currentUser?.name || '')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                            <p className="text-xs sm:text-sm font-medium leading-none truncate max-w-24 sm:max-w-32">{currentUser?.name}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex h-8 w-8 sm:h-9 sm:w-9">
                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="mx-auto px-4 py-4 space-y-2 max-w-6xl">
                        {/* Balance on mobile */}
                        {currentUser?.walletBalance !== undefined && (
                            <>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm text-muted-foreground">Balance</span>
                                    <Badge variant="secondary" className="font-mono text-sm">
                                        {formatCurrency(currentUser.walletBalance)}
                                    </Badge>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Navigation Links */}
                        <nav className="space-y-1 py-2">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className="w-full justify-start gap-3 h-10"
                                        >
                                            <link.icon className="h-4 w-4" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        <Separator />

                        {/* Logout */}
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-destructive hover:text-destructive h-10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
