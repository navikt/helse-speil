import React from 'react';
import { ToastObject } from '../../state/toasts';
import { nanoid } from 'nanoid';

export const vedtaksstatusToastKey = 'vedtakstatus';

export const vedtaksstatusToast = (message: string): ToastObject => ({
    key: nanoid(),
    timeToLiveMs: 5000,
    message,
});
