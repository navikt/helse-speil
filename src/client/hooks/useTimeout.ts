import { useEffect } from 'react';

interface UseTimeoutOptions {
    trigger: boolean;
    timeout: number;
    callback: () => void;
    cleanup?: () => void;
}

export const useTimeout = ({ trigger, timeout, callback, cleanup }: UseTimeoutOptions) => {
    useEffect(() => {
        if (trigger) {
            const timeoutId = setTimeout(callback, timeout);
            return () => {
                clearTimeout(timeoutId);
            };
        }
        return () => {
            cleanup?.();
        };
    }, [trigger]);
};
