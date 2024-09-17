import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useRef } from 'react';

import { Loader } from '@navikt/ds-react';

import { useAddToast, useRemoveToast } from '@state/toasts';

import { useDebounce } from './useDebounce';

interface UseIsLoadingToastOptions {
    isLoading: boolean;
    message: ReactNode;
}

export const useLoadingToast = ({ isLoading, message }: UseIsLoadingToastOptions) => {
    const showToast = useDebounce(isLoading);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const toastKey = useRef(nanoid());

    useEffect(() => {
        const current = toastKey.current;
        if (showToast) {
            addToast({
                key: current,
                message: (
                    <>
                        {message} <Loader size="xsmall" variant="inverted" />
                    </>
                ),
            });
        } else {
            removeToast(current);
        }
        return () => removeToast(current);
    }, [addToast, message, removeToast, showToast]);
};
