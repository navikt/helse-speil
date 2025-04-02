import React, { ReactElement } from 'react';

import { Alert, Box, HStack, Heading, HelpText } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Maybe,
    PersonFragment,
    UberegnetPeriodeFragment,
    Utbetalingsdagtype,
} from '@io/graphql';
import {
    useCurrentArbeidsgiver,
    useDagoverstyringer,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { capitalizeArbeidsgiver } from '@utils/locale';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';
import { isBeregnetPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

import { harPeriodeTilBeslutterFor } from '../sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

const useIsInCurrentGeneration = (person: PersonFragment): boolean => {
    const period = useActivePeriod(person);
    const arbeidsgiver = useCurrentArbeidsgiver(person);

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
    arbeidsgiverNavn: string;
}

const ReadonlyUtbetaling = ({ fom, tom, dager, person, arbeidsgiverNavn }: ReadonlyUtbetalingProps): ReactElement => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);
    const periodeErISisteGenerasjon = useIsInCurrentGeneration(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const harTidligereSkjæringstidspunktOgISisteGenerasjon = !hasLatestSkjæringstidspunkt && periodeErISisteGenerasjon;

    return (
        <Box paddingBlock="8 16" paddingInline="6" position="relative">
            <HStack align="center" gap="1">
                <Heading size="xsmall" level="1">
                    Dagoversikt{' '}
                    <AnonymizableContainer as="span">{capitalizeArbeidsgiver(arbeidsgiverNavn)}</AnonymizableContainer>
                </Heading>
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
                />
            </Box>
        </Box>
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
    const readOnly = useIsReadOnlyOppgave(person);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const dager: Map<string, Utbetalingstabelldag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    const kanEndres = overstyringIsEnabled.value || revurderingIsEnabled.value || overstyrRevurderingIsEnabled.value;

    return kanEndres && !readOnly && erAktivPeriodeLikEllerFørPeriodeTilGodkjenning ? (
        <OverstyrbarUtbetaling person={person} arbeidsgiver={arbeidsgiver} dager={dager} periode={period} />
    ) : (
        <ReadonlyUtbetaling
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            person={person}
            arbeidsgiverNavn={arbeidsgiver.navn}
        />
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
    const antallAGPDagerBruktFørPerioden = arbeidsgiver.generasjoner[0]?.perioder
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
    if (!person) return null;

    const skjæringstidspunktHarPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return !skjæringstidspunktHarPeriodeTilBeslutter ? (
        <OverstyrbarUtbetaling person={person} arbeidsgiver={arbeidsgiver} dager={dager} periode={periode} />
    ) : (
        <ReadonlyUtbetaling
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            person={person}
            arbeidsgiverNavn={arbeidsgiver.navn}
        />
    );
};

type UtbetalingProps = {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment;
};

const UtbetalingContainer = ({ person, periode }: UtbetalingProps): Maybe<ReactElement> => {
    const arbeidsgiver = useCurrentArbeidsgiver(person);

    if (!isPerson(person) || !arbeidsgiver) {
        return null;
    }

    if (isBeregnetPeriode(periode)) {
        return <UtbetalingBeregnetPeriodeMemoized period={periode} person={person} arbeidsgiver={arbeidsgiver} />;
    } else if (isUberegnetPeriode(periode)) {
        return <UtbetalingUberegnetPeriode person={person} periode={periode} arbeidsgiver={arbeidsgiver} />;
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
