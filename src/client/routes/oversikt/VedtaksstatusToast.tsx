import React from 'react';
import { ToastObject } from '../../state/toastsState';

export const vedtaksstatusToastKey = 'vedtaksstatusToast';

export const vedtaksstatusToast = (message: string, callback?: () => void): ToastObject => ({
    key: vedtaksstatusToastKey,
    timeToLiveMs: 5000,
    message,
    callback,
});
