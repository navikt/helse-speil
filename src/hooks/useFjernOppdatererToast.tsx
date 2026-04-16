import { useEffect, useRef } from 'react';

import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useRemoveToast } from '@state/toasts';

export const useFjernOppdatererToast = (visningenOppdateres: boolean, setHasTimedOut: () => void) => {
    const removeToast = useRemoveToast();

    const setHasTimedOutRef = useRef(setHasTimedOut);
    setHasTimedOutRef.current = setHasTimedOut;

    const removeToastRef = useRef(removeToast);
    removeToastRef.current = removeToast;

    useEffect(() => {
        if (visningenOppdateres) {
            const timeout = setTimeout(() => {
                setHasTimedOutRef.current();
            }, 15000);
            return () => {
                removeToastRef.current(visningenOppdateresToastKey);
                clearTimeout(timeout);
            };
        }
    }, [visningenOppdateres]);
};
