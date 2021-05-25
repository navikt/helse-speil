import { nanoid } from 'nanoid';
import React from 'react';

import { ToastObject } from '../../state/toasts';

export const vedtaksstatusToastKey = 'vedtakstatus';

export const vedtaksstatusToast = (message: string): ToastObject => ({
    key: nanoid(),
    timeToLiveMs: 5000,
    message,
});
