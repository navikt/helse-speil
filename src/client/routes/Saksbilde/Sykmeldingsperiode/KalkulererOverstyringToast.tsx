import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ToastObject, toastsState, useFjernEnToast } from '../../../state/toastsState';
import styled from '@emotion/styled';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Toast } from '../../../components/Toast';

export const kalkulererToastKey = 'kalkulererToast';

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
    const overstyringToast = useRecoilValue(toastsState)
        .filter((toast) => toast.key === kalkulererToastKey)
        .pop();

    const fjernToast = useFjernEnToast();

    useEffect(() => {
        return () => {
            fjernToast(kalkulererToastKey);
        };
    }, []);

    if (!overstyringToast) return null;

    return (
        <Toast callback={overstyringToast.callback} timeToLiveMs={overstyringToast.timeToLiveMs}>
            <Container>
                <Tekst>{overstyringToast.message}</Tekst>
                <SpinnerMedMarginTilVenstre transparent type="S" />
            </Container>
        </Toast>
    );
};
