import React from 'react';

import { Loader } from '@navikt/ds-react';

import type { ToastObject } from './toasts';

export const visningenOppdateresToastKey = 'visningenOppdateresToast';

export const visningenErOppdatertToastKey = 'visningenErOppdatertToast';

export const visningenOppdateresToast = ({
    message = (
        <>
            Visningen oppdateres <Loader size="xsmall" variant="inverted" />
        </>
    ),
    callback,
    timeToLiveMs,
}: Partial<ToastObject>): ToastObject => ({
    key: visningenOppdateresToastKey,
    message,
    callback,
    timeToLiveMs,
});

export const visningenErOppdatertToast = ({
    message = 'Visningen er oppdatert',
    timeToLiveMs = 5000,
    callback,
}: Partial<ToastObject>): ToastObject => ({
    key: visningenErOppdatertToastKey,
    message,
    callback,
    timeToLiveMs,
});
