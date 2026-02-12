import React, { ReactElement } from 'react';

import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { DatePeriod } from '@typer/shared';
import { cn } from '@utils/tw';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './InfoPin.module.css';

const shouldShowInfoPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period)) return false;

    return period.tidslinje.some(
        (dag) =>
            ![Utbetalingsdagtype.Helgedag, Utbetalingsdagtype.Navdag, Utbetalingsdagtype.Navhelgdag].includes(
                dag.utbetalingsdagtype,
            ) || [Sykdomsdagtype.Permisjonsdag].includes(dag.sykdomsdagtype),
    );
};

interface InfoPinProps {
    period: DatePeriod;
}

const useHarGenereltNotat = (period: DatePeriod) => {
    const vedtaksperiodeId =
        isBeregnetPeriode(period) || isUberegnetPeriode(period) ? period.vedtaksperiodeId : undefined;
    const { data } = useGetNotaterForVedtaksperiode(vedtaksperiodeId!, {
        query: {
            enabled: vedtaksperiodeId !== undefined,
        },
    });

    return data?.some((notat) => notat.type === 'Generelt') || false;
};

export const InfoPin = ({ period }: InfoPinProps): ReactElement | null => {
    const showInfoPin = shouldShowInfoPin(period);
    const showNotatPin = useHarGenereltNotat(period);

    if (!showInfoPin && !showNotatPin) {
        return null;
    }

    return <div className={cn(styles.Pin, showNotatPin && styles.notat)} />;
};
