import React from 'react';

import { Loader } from '@navikt/ds-react';

import type { ToastObject } from './toasts';

export const kalkulererToastKey = 'kalkulererToast';

export const kalkulererFerdigToastKey = 'kalkulererFerdigToast';

export const kalkulererToast = ({
    message = (
        <>
            Kalkulerer endringer <Loader size="xsmall" variant="inverted" />
        </>
    ),
    callback,
    timeToLiveMs,
}: Partial<ToastObject>): ToastObject => ({
    key: kalkulererToastKey,
    message,
    callback,
    timeToLiveMs,
});

export const kalkuleringFerdigToast = ({
    message = 'Oppgaven er ferdig kalkulert',
    timeToLiveMs = 5000,
    callback,
}: Partial<ToastObject>): ToastObject => ({
    key: kalkulererFerdigToastKey,
    message,
    callback,
    timeToLiveMs,
});
