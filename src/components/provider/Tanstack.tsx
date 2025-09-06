import React, { useState } from 'react';
import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface TanstackProps {
    children: React.ReactNode;
}

export const Tanstack: FC<TanstackProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    );
};
