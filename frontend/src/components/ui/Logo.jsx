import React from 'react';

export const Logo = ({ className, ...props }) => {
    return (
        <svg className={className} width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            {/* Ícone */}
            <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.1" />
            <rect x="6" y="23" width="5" height="10" rx="1.5" fill="currentColor" fillOpacity="0.3" />
            <rect x="14" y="17" width="5" height="16" rx="1.5" fill="currentColor" fillOpacity="0.6" />
            <rect x="22" y="10" width="5" height="23" rx="1.5" fill="currentColor" />
            <path d="M29 12 L34 7 M34 7 L34 12 M34 7 L29 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Wordmark */}
            <text x="50" y="27" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="22" fill="currentColor" letterSpacing="-0.5">Mark</text>
            <text x="102" y="27" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="22" fill="currentColor" letterSpacing="-0.5">ap</text>
        </svg>
    );
};



export const Icon = ({ className }) => {
    return (
        <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#1A6B4A" />
            <rect x="8" y="28" width="6" height="12" rx="2" fill="rgba(167,243,208,0.5)" />
            <rect x="17" y="20" width="6" height="20" rx="2" fill="rgba(167,243,208,0.75)" />
            <rect x="26" y="12" width="6" height="28" rx="2" fill="#FFFFFF" />
            <path d="M34 14 L40 8 M40 8 L40 14 M40 8 L34 8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
