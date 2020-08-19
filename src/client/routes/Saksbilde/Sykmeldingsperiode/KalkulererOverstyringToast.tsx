import React, { useEffect } from 'react';
import { AdvarselToast } from '../../../components/Toast';
import { useRecoilValue } from 'recoil';
import { Toast, toastsState, useFjernEnToast } from '../../../state/toastsState';
import styled from '@emotion/styled';
import NavFrontendSpinner from 'nav-frontend-spinner';

export const kalkulererToastKey = 'kalkulererToast';

export const kalkulererToast = (callback?: () => void): Toast => ({
    key: kalkulererToastKey,
    message: 'Kalkulerer endringer',
    callback,
});

const SpinnerMedMarginTilVenstre = styled(NavFrontendSpinner)`
    margin-left: 1rem;
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
        <AdvarselToast callback={overstyringToast.callback}>
            {overstyringToast.message}
            <SpinnerMedMarginTilVenstre transparent type="S" />
        </AdvarselToast>
    );
};
