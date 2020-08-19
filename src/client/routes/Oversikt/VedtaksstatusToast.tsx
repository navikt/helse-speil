import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Toast, toastsState, useFjernEnToast } from '../../state/toastsState';
import { SuksessToast } from '../../components/Toast';

export const vedtaksstatusToastKey = 'vedtaksstatusToast';

export const vedtaksstatusToast = (message: string, callback?: () => void): Toast => ({
    key: vedtaksstatusToastKey,
    timeToLiveMs: 5000,
    message,
    callback,
});

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
        <SuksessToast callback={vedtaksstatusToast.callback} timeToLiveMs={vedtaksstatusToast.timeToLiveMs}>
            {vedtaksstatusToast.message}
        </SuksessToast>
    );
};
