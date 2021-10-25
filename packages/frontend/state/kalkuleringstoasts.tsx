import styled from '@emotion/styled';
import React from 'react';

import { Loader } from '@navikt/ds-react';

import type { ToastObject } from './toasts';

export const kalkulererToastKey = 'kalkulererToast';

export const kalkulererFerdigToastKey = 'kalkulererFerdigToast';

const Spinner = styled(Loader)`
    margin-left: 1rem;
`;

export const kalkulererToast = ({
    message = (
        <>
            Kalkulerer endringer <Spinner size="xsmall" />
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
