import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActivePeriodHasLatestSkjæringstidspunkt,
    useOverstyrRevurderingIsEnabled,
    useRevurderingIsEnabled,
} from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiver, Dagoverstyring, Overstyring, UberegnetPeriode } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { kanOverstyres } from '@utils/overstyring';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

import styles from './Utbetaling.module.css';

const useIsInCurrentGeneration = (): boolean => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver) {
        return false;
    }

    return isInCurrentGeneration(period, arbeidsgiver);
};

interface ReadonlyUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
}

const ReadonlyUtbetaling: React.FC<ReadonlyUtbetalingProps> = ({ fom, tom, dager }) => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const periodeErISisteGenerasjon = useIsInCurrentGeneration();

    return (
        <div className={styles.Utbetaling}>
            {!hasLatestSkjæringstidspunkt && periodeErISisteGenerasjon && (
                <div className={styles.Infopin}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er ikke mulig å gjøre endringer i denne perioden</p>
                    </PopoverHjelpetekst>
                </div>
            )}
            <div className={styles.Container} data-testid="utbetaling">
                <Utbetalingstabell fom={fom} tom={tom} dager={dager} />
            </div>
        </div>
    );
};

const isDagoverstyring = (overstyring: Overstyring): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring).__typename === 'Dagoverstyring';

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    arbeidsgiver?: Maybe<Arbeidsgiver>
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!arbeidsgiver) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return arbeidsgiver.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            })
        );
    }, [arbeidsgiver, fom, tom]);
};

interface UtbetalingBeregnetPeriodeProps {
    period: FetchedBeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingBeregnetPeriode: React.FC<UtbetalingBeregnetPeriodeProps> = React.memo(({ period, arbeidsgiver }) => {
    const overstyringIsEnabled = kanOverstyres(period);
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);
    const dagoverstyringer = useDagoverstyringer(period.fom, period.tom, arbeidsgiver);
    const readOnly = useIsReadOnlyOppgave();

    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    return (revurderingIsEnabled || overstyringIsEnabled.value || overstyrRevurderingIsEnabled) &&
        !readOnly &&
        !period.oppgave?.erBeslutter ? (
        <OverstyrbarUtbetaling
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            skjæringstidspunkt={period.skjaeringstidspunkt}
            utbetaling={period.utbetaling}
            revurderingIsEnabled={revurderingIsEnabled}
            overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
        />
    ) : (
        <ReadonlyUtbetaling fom={period.fom} tom={period.tom} dager={dager} />
    );
});

interface UtbetalingUberegnetPeriodeProps {
    periode: UberegnetPeriode;
}

const UtbetalingUberegnetPeriode: React.FC<UtbetalingUberegnetPeriodeProps> = ({ periode }) => {
    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: periode.tidslinje,
    });
    return <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />;
};

const UtbetalingContainer = () => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!activePeriod || !currentArbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        return <UtbetalingBeregnetPeriode period={activePeriod} arbeidsgiver={currentArbeidsgiver} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UtbetalingUberegnetPeriode periode={activePeriod} />;
    } else {
        return null;
    }
};

const UtbetalingSkeleton = () => {
    return <div />;
};

const UtbetalingError = () => {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise utbetaling for denne perioden.
        </Alert>
    );
};

export const Utbetaling = () => {
    return (
        <React.Suspense fallback={<UtbetalingSkeleton />}>
            <ErrorBoundary fallback={<UtbetalingError />}>
                <UtbetalingContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default Utbetaling;
