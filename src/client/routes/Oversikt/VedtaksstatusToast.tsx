import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ToastObject, toastsState, useFjernEnToast } from '../../state/toastsState';
import styled from '@emotion/styled';
import { TimeoutToast } from '../../components/toasts/TimeoutToast';

export const vedtaksstatusToastKey = 'vedtaksstatusToast';

export const vedtaksstatusToast = (message: string, callback?: () => void): ToastObject => ({
    key: vedtaksstatusToastKey,
    timeToLiveMs: 5000,
    message,
    callback,
});

const Tekst = styled.p``;

export const VedtaksstatusToast = () => {
    const vedtaksstatusToast = useRecoilValue(toastsState)
        .filter((toast) => toast.key === vedtaksstatusToastKey)
        .pop();

    const fjernToast = useFjernEnToast();

    useEffect(() => {
        return () => {
            fjernToast(vedtaksstatusToastKey);
        };
    }, []);

    if (!vedtaksstatusToast) return null;

    return (
        <TimeoutToast callback={vedtaksstatusToast.callback} timeToLiveMs={vedtaksstatusToast.timeToLiveMs}>
            <Tekst>{vedtaksstatusToast.message}</Tekst>
        </TimeoutToast>
    );
};
