import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    PersonFragment,
    UberegnetPeriodeFragment,
    Utbetalingsdagtype,
    Utbetalingstatus,
} from '@io/graphql';
import { useCurrentPerson } from '@person/query';
import {
    useCurrentArbeidsgiver,
    useDagoverstyringer,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useGjenståendeDager,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { isBeregnetPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

import { harPeriodeTilBeslutterFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjonUtils';
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
    dager: Map<string, Utbetalingstabelldag>;
}

const ReadonlyUtbetaling = ({ fom, tom, dager }: ReadonlyUtbetalingProps): ReactElement => {
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

interface UtbetalingBeregnetPeriodeProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

const UtbetalingBeregnetPeriode = ({ period, person, arbeidsgiver }: UtbetalingBeregnetPeriodeProps): ReactElement => {
    const overstyringIsEnabled = kanOverstyres(period);
    const revurderingIsEnabled = kanRevurderes(person, period);
    const overstyrRevurderingIsEnabled = kanOverstyreRevurdering(person, period);
    const dagoverstyringer = useDagoverstyringer(period.fom, period.tom, arbeidsgiver);
    const readOnly = useIsReadOnlyOppgave();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    const gjenståendeDager = useGjenståendeDager(period);

    const dager: Map<string, Utbetalingstabelldag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: gjenståendeDager ?? period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    const kanEndres = overstyringIsEnabled.value || revurderingIsEnabled.value || overstyrRevurderingIsEnabled.value;

    return kanEndres && !readOnly && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling
            person={person}
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            erForkastet={period.utbetaling.status === Utbetalingstatus.Forkastet}
            revurderingIsEnabled={revurderingIsEnabled.value}
            overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled.value}
            vedtaksperiodeId={period.vedtaksperiodeId}
        />
    ) : (
        <ReadonlyUtbetaling fom={period.fom} tom={period.tom} dager={dager} />
    );
};

const UtbetalingBeregnetPeriodeMemoized = React.memo(UtbetalingBeregnetPeriode);

interface UtbetalingUberegnetPeriodeProps {
    periode: UberegnetPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

const UtbetalingUberegnetPeriode = ({
    periode,
    arbeidsgiver,
}: UtbetalingUberegnetPeriodeProps): ReactElement | null => {
    const dagoverstyringer = useDagoverstyringer(periode.fom, periode.tom, arbeidsgiver);
    const antallAGPDagerBruktFørPerioden = arbeidsgiver.generasjoner[0].perioder
        .filter((it) => it.skjaeringstidspunkt === periode.skjaeringstidspunkt)
        .filter((it) => it.fom < periode.fom)
        .reverse()
        .flatMap((it) => it.tidslinje)
        .filter(
            (dag) =>
                dag.utbetalingsdagtype === 'ARBEIDSGIVERPERIODEDAG' ||
                (['SYKEDAG', 'SYK_HELGEDAG'].includes(dag.sykdomsdagtype) &&
                    dag.utbetalingsdagtype === Utbetalingsdagtype.UkjentDag),
        ).length;
    const dager: Map<string, Utbetalingstabelldag> = useTabelldagerMap({
        tidslinje: periode.tidslinje,
        overstyringer: dagoverstyringer,
        antallAGPDagerBruktFørPerioden: antallAGPDagerBruktFørPerioden,
    });
    const person = useCurrentPerson();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    if (!person) return null;

    const skjæringstidspunktHarPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return !skjæringstidspunktHarPeriodeTilBeslutter && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling
            person={person}
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            erForkastet={false}
            revurderingIsEnabled={false}
            overstyrRevurderingIsEnabled={false}
            vedtaksperiodeId={periode.vedtaksperiodeId}
        />
    ) : (
        <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />
    );
};

const UtbetalingContainer = (): ReactElement | null => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !isPerson(person) || !arbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(period)) {
        return <UtbetalingBeregnetPeriodeMemoized period={period} person={person} arbeidsgiver={arbeidsgiver} />;
    } else if (isUberegnetPeriode(period)) {
        return <UtbetalingUberegnetPeriode periode={period} arbeidsgiver={arbeidsgiver} />;
    } else {
        return null;
    }
};

const UtbetalingError = (): ReactElement => {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise utbetaling for denne perioden.
        </Alert>
    );
};

// TODO: ta inn person som prop
export const Utbetaling = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<UtbetalingError />}>
            <UtbetalingContainer />
        </ErrorBoundary>
    );
};
