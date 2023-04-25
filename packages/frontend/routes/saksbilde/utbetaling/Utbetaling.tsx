import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiver, Dagoverstyring, Overstyring, UberegnetPeriode, Utbetalingstatus } from '@io/graphql';
import { useCurrentArbeidsgiver, useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isInCurrentGeneration } from '@state/selectors/period';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { isBeregnetPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

import { harPeriodeTilBeslutterFor } from '../sykepengegrunnlag/inntekt/InntektOgRefusjon';
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
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    const harTidligereSkjæringstidspunktOgISisteGenerasjon = !hasLatestSkjæringstidspunkt && periodeErISisteGenerasjon;

    return (
        <div className={styles.Utbetaling}>
            {!(hasLatestSkjæringstidspunkt || erAktivPeriodeLikEllerFørPeriodeTilGodkjenning) &&
                periodeErISisteGenerasjon && (
                    <div className={styles.Infopin}>
                        <PopoverHjelpetekst ikon={<SortInfoikon />}>
                            <p>
                                {harTidligereSkjæringstidspunktOgISisteGenerasjon
                                    ? 'Det er ikke mulig å gjøre endringer i denne perioden'
                                    : 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'}
                            </p>
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
    person: FetchedPerson;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingBeregnetPeriode: React.FC<UtbetalingBeregnetPeriodeProps> = React.memo(
    ({ period, person, arbeidsgiver }) => {
        const overstyringIsEnabled = kanOverstyres(period);
        const revurderingIsEnabled = kanRevurderes(person, period);
        const overstyrRevurderingIsEnabled = kanOverstyreRevurdering(person, period);
        const dagoverstyringer = useDagoverstyringer(period.fom, period.tom, arbeidsgiver);
        const readOnly = useIsReadOnlyOppgave();
        const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

        const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
            tidslinje: period.tidslinje,
            gjenståendeDager: period.gjenstaendeSykedager,
            overstyringer: dagoverstyringer,
            maksdato: period.maksdato,
        });

        const kanEndres =
            overstyringIsEnabled.value || revurderingIsEnabled.value || overstyrRevurderingIsEnabled.value;

        return kanEndres && !readOnly && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
            <OverstyrbarUtbetaling
                fom={period.fom}
                tom={period.tom}
                dager={dager}
                erForkastet={period.utbetaling.status === Utbetalingstatus.Forkastet}
                revurderingIsEnabled={revurderingIsEnabled.value}
                overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled.value}
            />
        ) : (
            <ReadonlyUtbetaling fom={period.fom} tom={period.tom} dager={dager} />
        );
    }
);

interface UtbetalingUberegnetPeriodeProps {
    periode: UberegnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingUberegnetPeriode: React.FC<UtbetalingUberegnetPeriodeProps> = ({ periode, arbeidsgiver }) => {
    const dagoverstyringer = useDagoverstyringer(periode.fom, periode.tom, arbeidsgiver);
    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: periode.tidslinje,
        overstyringer: dagoverstyringer,
    });
    const person = useCurrentPerson();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    if (!person) return null;

    const skjæringstidspunktHarPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return !skjæringstidspunktHarPeriodeTilBeslutter && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            erForkastet={false}
            revurderingIsEnabled={false}
            overstyrRevurderingIsEnabled={false}
        />
    ) : (
        <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />
    );
};

const UtbetalingContainer = () => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !isPerson(person) || !arbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(period)) {
        return <UtbetalingBeregnetPeriode period={period} person={person} arbeidsgiver={arbeidsgiver} />;
    } else if (isUberegnetPeriode(period)) {
        return <UtbetalingUberegnetPeriode periode={period} arbeidsgiver={arbeidsgiver} />;
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
