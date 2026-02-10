import { useEffect } from 'react';

import { QueryClient } from '@tanstack/react-query';

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__: QueryClient;
    }
}

// Chrome extentionen Tanstack Dev Tools trenger å få tilgang til query client på denne måten
export default function useExposeQueryClient(queryClient: QueryClient) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__TANSTACK_QUERY_CLIENT__ = queryClient;
        }
    }, [queryClient]);
}
