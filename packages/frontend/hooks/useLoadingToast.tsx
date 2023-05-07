import styled from '@emotion/styled';
// @ts-ignore
import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useRef } from 'react';

import { Loader } from '@navikt/ds-react';

import { useAddToast, useRemoveToast } from '@state/toasts';

import { useDebounce } from './useDebounce';

const Spinner = styled(Loader)`
    margin-left: 1rem;
`;

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
                        {message} <Spinner size="xsmall" />
                    </>
                ),
            });
        } else {
            removeToast(toastKey.current);
        }
        return () => removeToast(toastKey.current);
    }, [showToast]);
};
