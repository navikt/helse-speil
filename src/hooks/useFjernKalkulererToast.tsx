import { useEffect, useRef } from 'react';

import { kalkulererToastKey } from '@state/kalkuleringstoasts';
import { useRemoveToast } from '@state/toasts';

export const useFjernKalkulerToast = (calculating: boolean, setHasTimedOut: () => void) => {
    const removeToast = useRemoveToast();

    const setHasTimedOutRef = useRef(setHasTimedOut);
    setHasTimedOutRef.current = setHasTimedOut;

    const removeToastRef = useRef(removeToast);
    removeToastRef.current = removeToast;

    useEffect(() => {
        if (calculating) {
            const timeout = setTimeout(() => {
                setHasTimedOutRef.current();
            }, 15000);
            return () => {
                removeToastRef.current(kalkulererToastKey);
                clearTimeout(timeout);
            };
        }
    }, [calculating]);
};
