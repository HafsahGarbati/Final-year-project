import { Loader2, Wallet, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Full page loader
export const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
};

// Inline spinner
export const LoadingSpinner = ({ size = 'default', className = '' }) => {
    const sizes = {
        small: 'h-4 w-4',
        default: 'h-6 w-6',
        large: 'h-8 w-8',
    };

    return <Loader2 className={`animate-spin ${sizes[size]} ${className}`} />;
};

// Card skeleton
export const CardSkeleton = () => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-muted rounded animate-pulse w-1/4" />
                </div>
            </CardContent>
        </Card>
    );
};

// Transaction skeleton
export const TransactionSkeleton = () => {
    return (
        <div className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
            </div>
            <div className="h-5 bg-muted rounded animate-pulse w-16" />
        </div>
    );
};

// Stats skeleton
export const StatsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
                            <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Empty state
export const EmptyState = ({
    icon: Icon = Package,
    title = 'No data',
    description = 'Nothing to display yet',
    action
}) => {
    return (
        <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            {action}
        </div>
    );
};

// Success animation
export const SuccessAnimation = ({ message = 'Success!' }) => {
    return (
        <div className="text-center py-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <p className="font-medium text-lg">{message}</p>
        </div>
    );
};

// Loading button helper
export const LoadingButton = ({ loading, children, ...props }) => {
    return (
        <button {...props} disabled={loading || props.disabled}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};
