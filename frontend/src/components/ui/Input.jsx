import { cn } from '../../lib/utils';

export default function Input({ label, error, className, ...props }) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-medium text-text-primary ml-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'flex h-11 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                    error && 'border-danger focus-visible:ring-danger',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-danger mt-1 ml-1 font-medium">{error}</p>
            )}
        </div>
    );
}
