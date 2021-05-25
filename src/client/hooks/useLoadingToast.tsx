import styled from '@emotion/styled';
import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useRef } from 'react';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { useAddToast, useRemoveToast } from '../state/toasts';

import { useDebounce } from './useDebounce';

const Spinner = styled(NavFrontendSpinner)`
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
                        {message} <Spinner type="XS" />
                    </>
                ),
            });
        } else {
            removeToast(toastKey.current);
        }
        return () => removeToast(toastKey.current);
    }, [showToast]);
};
