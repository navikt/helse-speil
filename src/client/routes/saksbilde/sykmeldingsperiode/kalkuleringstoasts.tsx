import React from 'react';
import { ToastObject } from '../../../state/toastsState';
import styled from '@emotion/styled';
import NavFrontendSpinner from 'nav-frontend-spinner';

export const kalkulererToastKey = 'kalkulererToast';

export const kalkulererToast = ({
    message = (
        <>
            Kalkulerer endringer <Spinner type="XS" />
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

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

export const kalkuleringFerdigToast = ({
    message = 'Oppgaven er ferdig kalkulert',
    timeToLiveMs = 5000,
    callback,
}: Partial<ToastObject>): ToastObject => ({
    key: kalkulererToastKey,
    message,
    callback,
    timeToLiveMs,
});
