import { useEffect } from 'react';

import { kalkulererToastKey } from '@state/kalkuleringstoasts';
import { useRemoveToast } from '@state/toasts';

export const useFjernKalkulerToast = (calculating: boolean, setHasTimedOut: () => void) => {
    const removeToast = useRemoveToast();

    useEffect(() => {
        if (calculating) {
            const timeout: NodeJS.Timeout | number | null = setTimeout(() => {
                setHasTimedOut();
            }, 15000);
            return () => {
                removeToast(kalkulererToastKey);
                clearTimeout(timeout);
            };
        }
    }, [calculating]);

    return;
};
