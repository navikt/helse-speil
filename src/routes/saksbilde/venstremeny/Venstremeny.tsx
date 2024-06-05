import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { VenstremenyBeregnetPeriode } from './VenstremenyBeregnetPeriode';
import { VenstremenyGhostPeriode } from './VenstremenyGhostPeriode';
import { VenstremenyUberegnetPeriode } from './VenstremenyUberegnetPeriode';

import styles from './Venstremeny.module.css';

const VenstremenyContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    const { loading } = useFetchPersonQuery();

    if (loading) {
        return <VenstremenySkeleton />;
    }

    if (!currentPerson || !currentArbeidsgiver) {
        return null;
    }

    if (isGhostPeriode(activePeriod)) {
        return <VenstremenyGhostPeriode activePeriod={activePeriod} currentArbeidsgiver={currentArbeidsgiver} />;
    }

    if (isBeregnetPeriode(activePeriod)) {
        return (
            <VenstremenyBeregnetPeriode
                activePeriod={activePeriod}
                currentPerson={currentPerson}
                currentArbeidsgiver={currentArbeidsgiver}
            />
        );
    }

    if (isUberegnetPeriode(activePeriod)) {
        return <VenstremenyUberegnetPeriode activePeriod={activePeriod} currentArbeidsgiver={currentArbeidsgiver} />;
    }

    return null;
};

const VenstremenySkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Venstremeny, styles.Skeleton)}>
            <PeriodeCard.Skeleton />
            <UtbetalingCard.Skeleton />
        </section>
    );
};

const VenstremenyError: React.FC = () => {
    return (
        <section className={classNames(styles.Venstremeny, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise venstremenyen for perioden.</BodyShort>
        </section>
    );
};

export const Venstremeny: React.FC = () => {
    return (
        <ErrorBoundary fallback={<VenstremenyError />}>
            <VenstremenyContainer />
        </ErrorBoundary>
    );
};
