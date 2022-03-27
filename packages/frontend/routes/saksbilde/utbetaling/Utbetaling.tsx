import styled from '@emotion/styled';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';

import { Unlocked } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex, FlexColumn } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActiveGenerationIsLast,
    useActivePeriodHasLatestSkjæringstidspunkt,
    useOverstyrRevurderingIsEnabled,
    useRevurderingIsEnabled,
} from '@hooks/revurdering';
import { useMap } from '@hooks/useMap';
import { useOverstyringIsEnabled } from '@hooks/useOverstyringIsEnabled';
import { useMaybeAktivPeriode, useVedtaksperiode } from '@state/tidslinje';

import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { EndringForm } from './utbetalingstabell/EndringForm';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { ToggleOverstyringKnapp, UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';
import { Arbeidsgiver, BeregnetPeriode, Dagoverstyring, Overstyring } from '@io/graphql';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periodState';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiverState';
import { isBeregnetPeriode } from '@utils/typeguards';
import { Varsel } from '@components/Varsel';

const Container = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    padding-right: ${(props) => (props.overstyrer ? '1rem' : '2rem')};
    margin-left: ${(props) => (props.overstyrer ? '0.5rem' : '0')};
    border-left: ${(props) => (props.overstyrer ? '6px solid #0067C5' : '0')};
    margin-top: 1rem;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 13px;
    top: calc(28.5px + 64px);
`;

const Sticky = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
`;

const OverstyringHeader = styled(Flex)`
    min-height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 0 1.5rem 1rem;
    width: 100%;
    background-color: var(--speil-overstyring-background);
`;

const UtbetalingstabellContainer = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    height: 100%;
    padding-top: 2rem;
    background-color: ${(props) => (props.overstyrer ? 'var(--speil-overstyring-background)' : 'inherit')};
`;

const Feilmelding = styled(BodyShort)`
    margin-left: 2rem;
    color: var(--navds-color-text-error);
    font-weight: 600;
`;

const InfobobleContainer = styled.div`
    margin-top: 1rem;
    min-height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
`;

const BegrunnelsesContainer = styled.div`
    background: #fff;
    padding-top: 2rem;
    margin-bottom: -1px;
`;

const getKey = (dag: UtbetalingstabellDag) => dag.dato;

const erReellEndring = (endring: Partial<UtbetalingstabellDag>, dag: UtbetalingstabellDag): boolean =>
    (typeof endring.grad === 'number' && endring.grad !== dag.grad) ||
    (typeof endring.type === 'string' && endring.type !== dag.type);

interface OverstyrbarUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
    skjæringstidspunkt: DateString;
}

const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({ fom, tom, dager, skjæringstidspunkt }) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();

    const vedtaksperiode = useVedtaksperiode(useMaybeAktivPeriode()?.id) as Vedtaksperiode;

    const kunAgpEllerAvslåtteDager =
        vedtaksperiode?.utbetalingstidslinje?.every((dag) =>
            ['Avslått', 'Arbeidsgiverperiode', 'Helg'].includes(dag.type)
        ) ?? false;

    const toggleOverstyring = () => {
        setMarkerteDager(new Map());
        setOverstyrteDager(new Map());
        setOverstyrer(!overstyrer);
    };

    const onSubmitOverstyring = () => {
        postOverstyring(Array.from(overstyrteDager.values()), form.getValues('begrunnelse'));
        setOverstyrer(!overstyrer);
    };

    const toggleChecked = (dag: UtbetalingstabellDag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMarkerteDager(markerteDager.set(getKey(dag), dag));
        } else {
            markerteDager.delete(getKey(dag));
            setMarkerteDager(markerteDager);
        }
    };

    const onSubmitEndring = (endring: Partial<UtbetalingstabellDag>) => {
        const newOverstyrteDager = Array.from(markerteDager.values()).reduce(
            (map: Map<string, UtbetalingstabellDag>, dag: UtbetalingstabellDag) => {
                if (erReellEndring(endring, dag)) {
                    map.set(getKey(dag), { ...dag, ...endring });
                } else {
                    map.delete(getKey(dag));
                }
                return map;
            },
            new Map(overstyrteDager)
        );
        setOverstyrteDager(newOverstyrteDager);
        setMarkerteDager(new Map());
    };

    useEffect(() => {
        if (state === 'done') {
            setOverstyrteDager(new Map());
        }
    }, [state]);

    return (
        <Container data-testid="utbetaling" overstyrer={overstyrer}>
            {overstyrer ? (
                <OverstyringHeader>
                    <Bold>Huk av for dagene som skal endres til samme verdi</Bold>
                    <ToggleOverstyringKnapp type="button" onClick={toggleOverstyring} overstyrer={overstyrer}>
                        <Unlocked height={24} width={24} />
                        Avbryt
                    </ToggleOverstyringKnapp>
                </OverstyringHeader>
            ) : (
                <UtbetalingHeader
                    periodeErForkastet={vedtaksperiode.erForkastet}
                    toggleOverstyring={toggleOverstyring}
                    kunAgpEllerAvslåtteDager={kunAgpEllerAvslåtteDager}
                />
            )}
            <UtbetalingstabellContainer overstyrer={overstyrer}>
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={dager}
                    lokaleOverstyringer={overstyrteDager}
                    markerteDager={markerteDager}
                    overstyrer={overstyrer}
                />
                {overstyrer && (
                    <>
                        <CheckboxContainer>
                            <MarkerAlleDagerCheckbox
                                alleDager={dager}
                                markerteDager={markerteDager}
                                setMarkerteDager={setMarkerteDager}
                                skjæringstidspunkt={skjæringstidspunkt}
                            />
                            {Array.from(dager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    dagtype={dag.type}
                                    dato={dag.dato}
                                    erAGP={dag.erAGP}
                                    skjæringstidspunkt={skjæringstidspunkt}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato) !== undefined}
                                />
                            ))}
                        </CheckboxContainer>
                        <Sticky>
                            <EndringForm
                                markerteDager={markerteDager}
                                toggleOverstyring={toggleOverstyring}
                                onSubmitEndring={onSubmitEndring}
                            />
                        </Sticky>
                        <BegrunnelsesContainer>
                            <FormProvider {...form}>
                                <form onSubmit={(event) => event.preventDefault()}>
                                    <OverstyringForm
                                        overstyrteDager={overstyrteDager}
                                        toggleOverstyring={toggleOverstyring}
                                        onSubmit={onSubmitOverstyring}
                                    />
                                </form>
                            </FormProvider>
                        </BegrunnelsesContainer>
                    </>
                )}
            </UtbetalingstabellContainer>
            {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
            {state === 'hasError' && error && (
                <Feilmelding as="p" role="alert">
                    {error}
                </Feilmelding>
            )}
        </Container>
    );
};

interface ReadonlyUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
}

const ReadonlyUtbetaling: React.FC<ReadonlyUtbetalingProps> = ({ fom, tom, dager }) => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const activeGenerationIsLast = useActiveGenerationIsLast();

    return (
        <Container overstyrer={false}>
            {!hasLatestSkjæringstidspunkt && activeGenerationIsLast && (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            )}
            <UtbetalingstabellContainer data-testid="utbetaling" overstyrer={false}>
                <Utbetalingstabell fom={fom} tom={tom} dager={dager} />
            </UtbetalingstabellContainer>
        </Container>
    );
};

const isDagoverstyring = (overstyring: Overstyring): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring).__typename === 'Dagoverstyring';

const useDagoverstyringer = (arbeidsgiver: Arbeidsgiver, fom: DateString, tom: DateString): Array<Dagoverstyring> => {
    return useMemo(() => {
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

interface UtbetalingWithContentProps {
    period: BeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingWithContent: React.FC<UtbetalingWithContentProps> = React.memo(({ period, arbeidsgiver }) => {
    const overstyringIsEnabled = useOverstyringIsEnabled();
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);
    const activePeriodHasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const dagoverstyringer = useDagoverstyringer(arbeidsgiver, period.fom, period.tom);

    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    return (revurderingIsEnabled || overstyringIsEnabled || overstyrRevurderingIsEnabled) &&
        activePeriodHasLatestSkjæringstidspunkt ? (
        <OverstyrbarUtbetaling
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            skjæringstidspunkt={period.skjaeringstidspunkt}
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
    return <Varsel variant="feil">Noe gikk galt. Kan ikke vise utbetaling for denne perioden.</Varsel>;
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
