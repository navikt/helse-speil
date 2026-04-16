import { useEffect, useRef } from 'react';

import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { useRemoveToast } from '@state/toasts';

export const useFjernOppdatererToast = (visningenOppdateres: boolean) => {
    const removeToast = useRemoveToast();

    const removeToastRef = useRef(removeToast);
    removeToastRef.current = removeToast;

    useEffect(() => {
        if (visningenOppdateres) {
            return () => {
                removeToastRef.current(visningenOppdateresToastKey);
            };
        }
    }, [visningenOppdateres]);
};
