import { cn } from '../../lib/utils';

export default function Button({ className, variant = 'primary', size = 'md', ...props }) {
    const variants = {
        primary: 'bg-green-primary text-white hover:bg-opacity-90',
        secondary: 'bg-green-light text-green-primary border border-green-border hover:bg-green-border hover:bg-opacity-30',
        outline: 'bg-transparent border border-border text-text-primary hover:bg-background',
        ghost: 'bg-transparent text-text-secondary hover:bg-background',
        danger: 'bg-danger text-white hover:bg-opacity-90',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
