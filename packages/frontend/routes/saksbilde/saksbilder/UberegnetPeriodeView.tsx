import React, { ReactNode } from 'react';

import { Varsel } from '@components/Varsel';
import { isNotReady } from '@state/periode';
import { Dag, Sykdomsdagtype, UberegnetPeriode } from '@io/graphql';

import styles from './UberegnetPeriodeView.module.css';

const containsOnly = (days: Array<Dag>, ...dayTypes: Array<Sykdomsdagtype>): boolean => {
    const weekends = [Sykdomsdagtype.SykHelgedag, Sykdomsdagtype.FriskHelgedag];
    return days.every((dag) => [...dayTypes, ...weekends].includes(dag.sykdomsdagtype));
};

const containsPayment = (days: Array<Dag>): boolean => {
    return days.some((day) => typeof day.utbetalingsinfo?.utbetaling === 'number');
};

const getErrorMessage = (period: UberegnetPeriode): ReactNode => {
    if (isNotReady(period)) {
        return (
            <Varsel className={styles.Message} variant="info">
                Vedtaksperioden kan ikke vises, den ikke er klar til behandling ennå.
            </Varsel>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Feriedag)) {
        return (
            <Varsel className={styles.Message} variant="info">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
            </Varsel>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Permisjonsdag)) {
        return (
            <Varsel className={styles.Message} variant="info">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
            </Varsel>
        );
    }

    if (!containsPayment(period.tidslinje)) {
        return (
            <Varsel className={styles.Message} variant="info">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
            </Varsel>
        );
    }

    return (
        <Varsel className={styles.Message} variant="error">
            Kunne ikke lese informasjon om sakens tilstand.
        </Varsel>
    );
};

interface UberegnetPeriodeViewProps {
    activePeriod: UberegnetPeriode;
}

export const UberegnetPeriodeView = ({ activePeriod }: UberegnetPeriodeViewProps) => {
    const errorMelding = getErrorMessage(activePeriod);

    return (
        <div className={styles.UberegnetPeriodeView} data-testid="saksbilde-ufullstendig-vedtaksperiode">
            {errorMelding}
        </div>
    );
};

export default UberegnetPeriodeView;
