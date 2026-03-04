import { cn } from '../../lib/utils';

export default function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'bg-surface border border-border rounded-2xl shadow-sm overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn('p-6 border-b border-border', className)} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={cn('p-6 border-t border-border bg-background/30', className)} {...props}>
            {children}
        </div>
    );
}
