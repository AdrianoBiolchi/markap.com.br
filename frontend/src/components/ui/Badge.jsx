import { cn } from '../../lib/utils';

export default function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-light text-green-primary border border-green-border',
        warning: 'bg-amber-light text-amber border border-amber-border',
        danger: 'bg-danger-light text-danger border border-danger',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
