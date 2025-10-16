import React, { ReactElement } from 'react';

import { Alert, Box, HStack, Heading, HelpText } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { BeregnetPeriodeFragment, PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import styles from '@saksbilde/utbetaling/utbetalingstabell/UtbetalingHeader.module.css';
import {
    Inntektsforhold,
    InntektsforholdReferanse,
    tilReferanse,
    useAktivtInntektsforhold,
    useDagoverstyringer,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { getAntallAGPDagerBruktFørPerioden } from '@utils/periode';
import { isBeregnetPeriode, isPerson, isSelvstendigNaering, isUberegnetPeriode } from '@utils/typeguards';

import { harPeriodeTilBeslutterFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

const useIsInCurrentGeneration = (person: PersonFragment): boolean => {
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
    person: PersonFragment;
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
    const periodeErISisteGenerasjon = useIsInCurrentGeneration(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const harTidligereSkjæringstidspunktOgISisteGenerasjon = !hasLatestSkjæringstidspunkt && periodeErISisteGenerasjon;

    return (
        <Box paddingBlock="8 16" paddingInline="6" position="relative">
            <HStack align="center" gap="2">
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
                        {harTidligereSkjæringstidspunktOgISisteGenerasjon
                            ? 'Det er ikke mulig å gjøre endringer i denne perioden'
                            : 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'}
                    </HelpText>
                )}
            </HStack>
            <Box paddingBlock="8 0" data-testid="utbetaling">
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={dager}
                    personFødselsdato={person.personinfo.fodselsdato}
                    person={person}
                    erSelvstendigNæring={inntektsforholdReferanse.type === 'Selvstendig Næring'}
                />
            </Box>
        </Box>
    );
};

interface UtbetalingBeregnetPeriodeProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
    inntektsforhold: Inntektsforhold;
}

const UtbetalingBeregnetPeriode = ({
    period,
    person,
    inntektsforhold,
}: UtbetalingBeregnetPeriodeProps): ReactElement => {
    const overstyringIsEnabled = kanOverstyres(period);
    const revurderingIsEnabled = kanRevurderes(person, period);
    const overstyrRevurderingIsEnabled = kanOverstyreRevurdering(person, period);
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
    person: PersonFragment;
    periode: UberegnetPeriodeFragment;
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
    if (!person) return null;

    const skjæringstidspunktHarPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

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
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment;
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
