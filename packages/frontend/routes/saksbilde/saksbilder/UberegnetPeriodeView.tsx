import React, { ReactNode } from 'react';
import { Alert } from '@navikt/ds-react';

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
            <Alert className={styles.Message} variant="info" size="small">
                Vedtaksperioden kan ikke vises, den ikke er klar til behandling ennå.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Feriedag)) {
        return (
            <Alert className={styles.Message} variant="info" size="small">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Permisjonsdag)) {
        return (
            <Alert className={styles.Message} variant="info" size="small">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
            </Alert>
        );
    }

    if (!containsPayment(period.tidslinje)) {
        return (
            <Alert className={styles.Message} variant="info" size="small">
                Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
            </Alert>
        );
    }

    return (
        <Alert className={styles.Message} variant="error" size="small">
            Kunne ikke lese informasjon om sakens tilstand.
        </Alert>
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
