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
    Maybe,
    PersonFragment,
    UberegnetPeriodeFragment,
    Utbetalingsdagtype,
    Utbetalingstatus,
} from '@io/graphql';
import {
    useCurrentArbeidsgiver,
    useDagoverstyringer,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useGjenståendeDager,
} from '@state/arbeidsgiver';
import { useActivePeriodOld } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { isBeregnetPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

import { harPeriodeTilBeslutterFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

import styles from './Utbetaling.module.css';

const useIsInCurrentGeneration = (): boolean => {
    const period = useActivePeriodOld();
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
    person: PersonFragment;
}

const ReadonlyUtbetaling = ({ fom, tom, dager, person }: ReadonlyUtbetalingProps): ReactElement => {
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
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={dager}
                    personFødselsdato={person.personinfo.fodselsdato}
                />
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
            arbeidsgiver={arbeidsgiver}
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            erForkastet={period.utbetaling.status === Utbetalingstatus.Forkastet}
            revurderingIsEnabled={revurderingIsEnabled.value}
            overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled.value}
            vedtaksperiodeId={period.vedtaksperiodeId}
            periode={period}
        />
    ) : (
        <ReadonlyUtbetaling fom={period.fom} tom={period.tom} dager={dager} person={person} />
    );
};

const UtbetalingBeregnetPeriodeMemoized = React.memo(UtbetalingBeregnetPeriode);

interface UtbetalingUberegnetPeriodeProps {
    person: PersonFragment;
    periode: UberegnetPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

const UtbetalingUberegnetPeriode = ({
    person,
    periode,
    arbeidsgiver,
}: UtbetalingUberegnetPeriodeProps): Maybe<ReactElement> => {
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
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    if (!person) return null;

    const skjæringstidspunktHarPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return !skjæringstidspunktHarPeriodeTilBeslutter && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling
            person={person}
            arbeidsgiver={arbeidsgiver}
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            erForkastet={false}
            revurderingIsEnabled={false}
            overstyrRevurderingIsEnabled={false}
            vedtaksperiodeId={periode.vedtaksperiodeId}
            periode={periode}
        />
    ) : (
        <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} person={person} />
    );
};

type UtbetalingContainerProps = {
    person: PersonFragment;
};

const UtbetalingContainer = ({ person }: UtbetalingContainerProps): Maybe<ReactElement> => {
    const period = useActivePeriodOld();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !isPerson(person) || !arbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(period)) {
        return <UtbetalingBeregnetPeriodeMemoized period={period} person={person} arbeidsgiver={arbeidsgiver} />;
    } else if (isUberegnetPeriode(period)) {
        return <UtbetalingUberegnetPeriode person={person} periode={period} arbeidsgiver={arbeidsgiver} />;
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

type UtbetalingProps = {
    person: PersonFragment;
};

export const Utbetaling = ({ person }: UtbetalingProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<UtbetalingError />}>
            <UtbetalingContainer person={person} />
        </ErrorBoundary>
    );
};
