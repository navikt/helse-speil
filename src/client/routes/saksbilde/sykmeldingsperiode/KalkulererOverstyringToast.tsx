import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ToastObject, toastsState, useFjernEnToast } from '../../../state/toastsState';
import styled from '@emotion/styled';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { TimeoutToast } from '../../../components/toasts/TimeoutToast';

export const kalkulererToastKey = 'kalkulererToast';
export const kalkulererFerdigToastKey = 'kalkulererFerdigToast';

export const kalkulererToast = ({
    message = 'Kalkulerer endringer',
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

const SpinnerMedMarginTilVenstre = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const Tekst = styled.p`
    white-space: nowrap;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const KalkulererOverstyringToast = () => {
    const fjernToast = useFjernEnToast();

    const overstyringToast = useRecoilValue(toastsState)
        .filter((toast) => toast.key === kalkulererToastKey || toast.key === kalkulererFerdigToastKey)
        .pop();

    useEffect(() => {
        return () => {
            overstyringToast && fjernToast(overstyringToast.key);
        };
    }, [overstyringToast]);

    if (!overstyringToast) return null;

    return (
        <TimeoutToast callback={overstyringToast.callback} timeToLiveMs={overstyringToast.timeToLiveMs}>
            <Container>
                <Tekst>{overstyringToast.message}</Tekst>
                {overstyringToast.key === kalkulererToastKey && <SpinnerMedMarginTilVenstre transparent type="S" />}
            </Container>
        </TimeoutToast>
    );
};
