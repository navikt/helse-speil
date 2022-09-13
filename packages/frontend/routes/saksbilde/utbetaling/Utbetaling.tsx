import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Alert } from '@navikt/ds-react';

import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import {
    useActiveGenerationIsLast,
    useActivePeriodHasLatestSkjæringstidspunkt,
    useOverstyrRevurderingIsEnabled,
    useRevurderingIsEnabled,
} from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useOverstyringIsEnabled } from '@hooks/useOverstyringIsEnabled';
import { Arbeidsgiver, BeregnetPeriode, Dagoverstyring, Overstyring } from '@io/graphql';
import { defaultUtbetalingToggles, erDev, erLocal } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periode';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';

import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';
import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';

import styles from './Utbetaling.module.css';

interface ReadonlyUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
}

const ReadonlyUtbetaling: React.FC<ReadonlyUtbetalingProps> = ({ fom, tom, dager }) => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const activeGenerationIsLast = useActiveGenerationIsLast();

    return (
        <div className={styles.Utbetaling}>
            {!hasLatestSkjæringstidspunkt && activeGenerationIsLast && (
                <div className={styles.Infopin}>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt</p>
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
    arbeidsgiver?: Maybe<Arbeidsgiver>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!arbeidsgiver) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return arbeidsgiver.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [arbeidsgiver, fom, tom]);
};

interface UtbetalingWithContentProps {
    period: BeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingWithContent: React.FC<UtbetalingWithContentProps> = React.memo(({ period, arbeidsgiver }) => {
    const overstyringIsEnabled = useOverstyringIsEnabled();
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);
    const erAktivPeriodeISisteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const dagoverstyringer = useDagoverstyringer(period.fom, period.tom, arbeidsgiver);
    const readOnly = useIsReadOnlyOppgave();

    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    return (revurderingIsEnabled || overstyringIsEnabled || overstyrRevurderingIsEnabled) &&
        (erDev() || erLocal() || erAktivPeriodeISisteSkjæringstidspunkt) &&
        !readOnly &&
        !period.erBeslutterOppgave ? (
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

const UtbetalingContainer = () => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!activePeriod || !currentArbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        return <UtbetalingWithContent period={activePeriod} arbeidsgiver={currentArbeidsgiver} />;
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
