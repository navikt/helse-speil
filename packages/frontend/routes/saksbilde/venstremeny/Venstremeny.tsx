import React from 'react';
import classNames from 'classnames';
import { BodyShort, Loader } from '@navikt/ds-react';

import { Tooltip } from '@components/Tooltip';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periodState';
import { useCurrentPerson } from '@state/personState';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiverState';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { VenstremenyGhostPeriode } from './VenstremenyGhostPeriode';
import { VenstremenyBeregnetPeriode } from './VenstremenyBeregnetPeriode';

import styles from './Venstremeny.module.css';

const VenstremenyContainer: React.VFC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentPerson || !currentArbeidsgiver) {
        return null;
    } else if (isGhostPeriode(activePeriod)) {
        return (
            <VenstremenyGhostPeriode
                activePeriod={activePeriod}
                currentPerson={currentPerson}
                currentArbeidsgiver={currentArbeidsgiver}
            />
        );
    } else if (isBeregnetPeriode(activePeriod)) {
        return (
            <VenstremenyBeregnetPeriode
                activePeriod={activePeriod}
                currentPerson={currentPerson}
                currentArbeidsgiver={currentArbeidsgiver}
            />
        );
    } else {
        return null;
    }
};

const VenstremenySkeleton: React.VFC = () => {
    return (
        <div className={classNames(styles.Venstremeny, styles.Skeleton)}>
            <Loader size="large" />
        </div>
    );
};

const VenstremenyError: React.VFC = () => {
    return (
        <div className={classNames(styles.Venstremeny, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise venstremenyen for perioden.</BodyShort>
        </div>
    );
};

export const Venstremeny: React.VFC = () => {
    return (
        <React.Suspense fallback={<VenstremenySkeleton />}>
            <ErrorBoundary fallback={<VenstremenyError />}>
                <VenstremenyContainer />
                <Tooltip effect="solid" />
            </ErrorBoundary>
        </React.Suspense>
    );
};
