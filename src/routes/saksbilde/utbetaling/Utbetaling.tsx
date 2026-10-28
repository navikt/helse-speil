import React, { ReactElement } from 'react';

import { Alert, Box, HStack, Heading, HelpText } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { ApiBeregnetPeriode, ApiSaksbildePerson, ApiUberegnetPeriode } from '@io/rest/generated/spesialist.schemas';
import styles from '@saksbilde/utbetaling/utbetalingstabell/UtbetalingHeader.module.css';
import {
    Inntektsforhold,
    InntektsforholdReferanse,
    tilReferanse,
    useAktivtInntektsforhold,
    useDagoverstyringer,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { useHarBeslutteroppgaveForSkjæringstidspunkt, useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { getAntallAGPDagerBruktFørPerioden } from '@utils/periode';
import { isBeregnetPeriode, isPerson, isSelvstendigNaering, isUberegnetPeriode } from '@utils/typeguards';

import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

const useIsInCurrentBehandling = (person: ApiSaksbildePerson): boolean => {
    const period = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);

    if (!period || !inntektsforhold) {
        return false;
    }

    return isInCurrentGeneration(period, inntektsforhold);
};

interface ReadonlyUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, Utbetalingstabelldag>;
    person: ApiSaksbildePerson;
    inntektsforholdReferanse: InntektsforholdReferanse;
}

const ReadonlyUtbetaling = ({
    fom,
    tom,
    dager,
    person,
    inntektsforholdReferanse,
}: ReadonlyUtbetalingProps): ReactElement => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);
    const periodeErISisteBehandling = useIsInCurrentBehandling(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const harTidligereSkjæringstidspunktOgISisteBehandling = !hasLatestSkjæringstidspunkt && periodeErISisteBehandling;

    return (
        <Box paddingBlock="space-32 space-64" paddingInline="space-24" position="relative">
            <HStack align="center" gap="space-8">
                <Heading size="xsmall" level="1">
                    Dagoversikt
                </Heading>
                <Inntektsforholdnavn
                    inntektsforholdReferanse={inntektsforholdReferanse}
                    weight="semibold"
                    className={styles.mediumFontSize}
                />
                {!(hasLatestSkjæringstidspunkt || erAktivPeriodeLikEllerFørPeriodeTilGodkjenning) && (
                    <HelpText>
                        {harTidligereSkjæringstidspunktOgISisteBehandling
                            ? 'Det er ikke mulig å gjøre endringer i denne perioden'
                            : 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'}
                    </HelpText>
                )}
            </HStack>
            <Box paddingBlock="space-32 space-0" data-testid="utbetaling">
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={dager}
                    person={person}
                    erSelvstendigNæring={inntektsforholdReferanse.type === 'Selvstendig Næring'}
                />
            </Box>
        </Box>
    );
};

interface UtbetalingBeregnetPeriodeProps {
    period: ApiBeregnetPeriode;
    person: ApiSaksbildePerson;
    inntektsforhold: Inntektsforhold;
}

const UtbetalingBeregnetPeriode = ({
    period,
    person,
    inntektsforhold,
}: UtbetalingBeregnetPeriodeProps): ReactElement => {
    const harAktivOppgave = useAktivOppgaveForPeriode(period) !== null;
    const erBeslutteroppgave = useTotrinnsvurderingForPeriode(period)?.erBeslutteroppgave ?? false;
    const overstyringIsEnabled = kanOverstyres(period, { harAktivOppgave, erBeslutteroppgave });
    const revurderingIsEnabled = kanRevurderes(person, period, erBeslutteroppgave);
    const overstyrRevurderingIsEnabled = kanOverstyreRevurdering(person, period, erBeslutteroppgave);
    const dagoverstyringer = useDagoverstyringer(period.fom, period.tom, inntektsforhold);
    const readOnly = useIsReadOnlyOppgave(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const dager: Map<string, Utbetalingstabelldag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforhold),
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    const kanEndres = overstyringIsEnabled.value || revurderingIsEnabled.value || overstyrRevurderingIsEnabled.value;

    return kanEndres && !readOnly && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling person={person} inntektsforhold={inntektsforhold} dager={dager} periode={period} />
    ) : (
        <ReadonlyUtbetaling
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            person={person}
            inntektsforholdReferanse={tilReferanse(inntektsforhold)}
        />
    );
};

const UtbetalingBeregnetPeriodeMemoized = React.memo(UtbetalingBeregnetPeriode);

interface UtbetalingUberegnetPeriodeProps {
    person: ApiSaksbildePerson;
    periode: ApiUberegnetPeriode;
    inntektsforhold: Inntektsforhold;
}

const UtbetalingUberegnetPeriode = ({
    person,
    periode,
    inntektsforhold,
}: UtbetalingUberegnetPeriodeProps): ReactElement | null => {
    const dagoverstyringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforhold);
    const antallAGPDagerBruktFørPerioden = getAntallAGPDagerBruktFørPerioden(inntektsforhold, periode);
    const dager: Map<string, Utbetalingstabelldag> = useTabelldagerMap({
        tidslinje: periode.tidslinje,
        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforhold),
        overstyringer: dagoverstyringer,
        antallAGPDagerBruktFørPerioden: antallAGPDagerBruktFørPerioden,
    });
    const skjæringstidspunktHarPeriodeTilBeslutter = useHarBeslutteroppgaveForSkjæringstidspunkt(
        periode.skjaeringstidspunkt,
    );
    if (!person) return null;

    return !skjæringstidspunktHarPeriodeTilBeslutter ? (
        <OverstyrbarUtbetaling person={person} inntektsforhold={inntektsforhold} dager={dager} periode={periode} />
    ) : (
        <ReadonlyUtbetaling
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            person={person}
            inntektsforholdReferanse={tilReferanse(inntektsforhold)}
        />
    );
};

type UtbetalingProps = {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode;
};

const UtbetalingContainer = ({ person, periode }: UtbetalingProps): ReactElement | null => {
    const inntektsforhold = useAktivtInntektsforhold(person);

    if (!isPerson(person) || !inntektsforhold) {
        return null;
    }

    if (isBeregnetPeriode(periode)) {
        return <UtbetalingBeregnetPeriodeMemoized period={periode} person={person} inntektsforhold={inntektsforhold} />;
    } else if (isUberegnetPeriode(periode)) {
        return <UtbetalingUberegnetPeriode person={person} periode={periode} inntektsforhold={inntektsforhold} />;
    } else {
        return null;
    }
};

const UtbetalingError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise utbetaling for denne perioden.
    </Alert>
);

export const Utbetaling = ({ person, periode }: UtbetalingProps): ReactElement => (
    <ErrorBoundary fallback={<UtbetalingError />}>
        <UtbetalingContainer person={person} periode={periode} />
    </ErrorBoundary>
);
