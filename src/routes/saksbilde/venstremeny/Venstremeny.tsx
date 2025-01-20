import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Maybe } from '@io/graphql';
import { VenstremenyNyttInntektsforholdPeriode } from '@saksbilde/venstremeny/VenstremenyNyttInntektsforholdPeriode';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { VenstremenyBeregnetPeriode } from './VenstremenyBeregnetPeriode';
import { VenstremenyGhostPeriode } from './VenstremenyGhostPeriode';
import { VenstremenyUberegnetPeriode } from './VenstremenyUberegnetPeriode';

import styles from './Venstremeny.module.css';

const VenstremenyContainer = (): Maybe<ReactElement> => {
    const { loading, data } = useFetchPersonQuery();
    const currentPerson = data?.person ?? null;
    const activePeriod = useActivePeriod(currentPerson);
    const currentArbeidsgiver = useCurrentArbeidsgiver(currentPerson);

    if (loading) {
        return <VenstremenySkeleton />;
    }

    if (!currentPerson || !currentArbeidsgiver) {
        return null;
    }

    if (isGhostPeriode(activePeriod)) {
        return <VenstremenyGhostPeriode activePeriod={activePeriod} currentArbeidsgiver={currentArbeidsgiver} />;
    }

    if (isTilkommenInntekt(activePeriod)) {
        return (
            <VenstremenyNyttInntektsforholdPeriode
                activePeriod={activePeriod}
                currentArbeidsgiver={currentArbeidsgiver}
            />
        );
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
        return (
            <VenstremenyUberegnetPeriode
                activePeriod={activePeriod}
                currentArbeidsgiver={currentArbeidsgiver}
                currentPerson={currentPerson}
            />
        );
    }

    return null;
};

const VenstremenySkeleton = (): ReactElement => {
    return (
        <section className={classNames(styles.Venstremeny, styles.Skeleton)}>
            <PeriodeCard.Skeleton />
            <UtbetalingCard.Skeleton />
        </section>
    );
};

const VenstremenyError = (): ReactElement => {
    return (
        <section className={classNames(styles.Venstremeny, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise venstremenyen for perioden.</BodyShort>
        </section>
    );
};

export const Venstremeny = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<VenstremenyError />}>
            <VenstremenyContainer />
        </ErrorBoundary>
    );
};
