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
        if (showToast) {
            addToast({
                key: toastKey.current,
                message: (
                    <>
                        {message} <Loader size="xsmall" variant="inverted" />
                    </>
                ),
            });
        } else {
            removeToast(toastKey.current);
        }
        return () => removeToast(toastKey.current);
    }, [showToast]);
};
