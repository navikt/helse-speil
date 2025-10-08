import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useAktivtInntektsforhold } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { PeriodeCard } from './PeriodeCard';
import { UtbetalingCard } from './UtbetalingCard';
import { VenstremenyBeregnetPeriode } from './VenstremenyBeregnetPeriode';
import { VenstremenyGhostPeriode } from './VenstremenyGhostPeriode';
import { VenstremenyUberegnetPeriode } from './VenstremenyUberegnetPeriode';

import styles from './Venstremeny.module.css';

const VenstremenyContainer = (): ReactElement | null => {
    const { loading, data } = useFetchPersonQuery();
    const currentPerson = data?.person ?? null;
    const activePeriod = useActivePeriod(currentPerson);
    const inntektsforhold = useAktivtInntektsforhold(currentPerson);

    if (loading) {
        return <VenstremenySkeleton />;
    }

    if (!currentPerson || !inntektsforhold) {
        return null;
    }

    if (isGhostPeriode(activePeriod) && isArbeidsgiver(inntektsforhold)) {
        return (
            <VenstremenyGhostPeriode
                activePeriod={activePeriod}
                currentArbeidsgiver={inntektsforhold}
                inntektsforhold={inntektsforhold}
            />
        );
    }

    if (isBeregnetPeriode(activePeriod)) {
        return (
            <VenstremenyBeregnetPeriode
                activePeriod={activePeriod}
                currentPerson={currentPerson}
                inntektsforhold={inntektsforhold}
            />
        );
    }

    if (isUberegnetPeriode(activePeriod)) {
        return (
            <VenstremenyUberegnetPeriode
                activePeriod={activePeriod}
                inntektsforhold={inntektsforhold}
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
