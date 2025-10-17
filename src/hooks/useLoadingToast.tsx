import React, { ReactNode, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

import { Loader } from '@navikt/ds-react';

import { useAddToast, useRemoveToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

interface UseIsLoadingToastOptions {
    isLoading: boolean;
    message: ReactNode;
}

export const useLoadingToast = ({ isLoading, message }: UseIsLoadingToastOptions) => {
    const [showToast] = useDebounce(isLoading, 250);

    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const toastKey = useRef(generateId());

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
