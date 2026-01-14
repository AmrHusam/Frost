import React from 'react';

export const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex h-full w-full items-center justify-center p-8 text-center">
        <div style={{ maxWidth: '400px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>{title}</h1>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', lineHeight: 1.6 }}>
                The {title.toLowerCase()} module is being synchronized with the backend.
                Full functionality will be available shortly.
            </p>
        </div>
    </div>
);
