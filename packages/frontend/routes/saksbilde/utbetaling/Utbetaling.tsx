import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { PopoverHjelpetekst } from '../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../components/ikoner/SortInfoikon';
import {
    useErAktivPeriodeISisteSkjæringstidspunkt,
    useErTidslinjeperiodeISisteGenerasjon,
    useOverstyrRevurderingIsEnabled,
    useRevurderingIsEnabled,
} from '../../../hooks/revurdering';
import { useMap } from '../../../hooks/useMap';
import { useOverstyringIsEnabled } from '../../../hooks/useOverstyringIsEnabled';
import { useGjenståendeDager, useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { useMaybeAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { defaultUtbetalingToggles } from '../../../featureToggles';
import { EndringForm } from './utbetalingstabell/EndringForm';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import type { UtbetalingstabellDag } from './utbetalingstabell/Utbetalingstabell.types';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';

const Container = styled(FlexColumn)`
    position: relative;
    padding-bottom: 4rem;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: calc(28.5px + 64px);
`;

const Sticky = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
`;

const UtbetalingstabellContainer = styled(FlexColumn)`
    position: relative;
    height: 100%;
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

const getKey = (dag: UtbetalingstabellDag) => dag.dato.format(NORSK_DATOFORMAT);

const erReellEndring = (endring: Partial<UtbetalingstabellDag>, dag: UtbetalingstabellDag): boolean =>
    (endring.gradering !== undefined && endring.gradering !== dag.gradering) ||
    (endring.type !== undefined && endring.type !== dag.type);

interface OverstyrbarUtbetalingProps {
    fom: Dayjs;
    tom: Dayjs;
    dager: Map<string, UtbetalingstabellDag>;
    skjæringstidspunkt: string;
}

const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({ fom, tom, dager, skjæringstidspunkt }) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();

    const vedtaksperiode = useVedtaksperiode(useMaybeAktivPeriode()?.id) as Vedtaksperiode;

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
        <Container data-testid="utbetaling">
            {overstyrer ? (
                <Sticky>
                    <EndringForm
                        markerteDager={markerteDager}
                        toggleOverstyring={toggleOverstyring}
                        onSubmitEndring={onSubmitEndring}
                    />
                </Sticky>
            ) : (
                <UtbetalingHeader
                    periodeErForkastet={vedtaksperiode.erForkastet}
                    toggleOverstyring={toggleOverstyring}
                />
            )}
            <UtbetalingstabellContainer>
                <Utbetalingstabell fom={fom} tom={tom} dager={dager} lokaleOverstyringer={overstyrteDager} />
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
                                    dato={dag.dato}
                                    dagtype={dag.type}
                                    skjæringstidspunkt={skjæringstidspunkt}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato.format(NORSK_DATOFORMAT)) !== undefined}
                                />
                            ))}
                        </CheckboxContainer>
                        <FormProvider {...form}>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <OverstyringForm
                                    overstyrteDager={overstyrteDager}
                                    toggleOverstyring={toggleOverstyring}
                                    onSubmit={onSubmitOverstyring}
                                />
                            </form>
                        </FormProvider>
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
    fom: Dayjs;
    tom: Dayjs;
    dager: Map<string, UtbetalingstabellDag>;
}

const ReadonlyUtbetaling: React.FC<ReadonlyUtbetalingProps> = ({ fom, tom, dager }) => {
    const erAktivPeriodeISisteSkjæringstidspunkt = useErAktivPeriodeISisteSkjæringstidspunkt();
    const erTidslinjeperiodeISisteGenerasjon = useErTidslinjeperiodeISisteGenerasjon();

    return (
        <Container>
            {!erAktivPeriodeISisteSkjæringstidspunkt && erTidslinjeperiodeISisteGenerasjon && (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            )}
            <UtbetalingstabellContainer data-testid="utbetaling">
                <Utbetalingstabell fom={fom} tom={tom} dager={dager} />
            </UtbetalingstabellContainer>
        </Container>
    );
};

interface UtbetalingProps {
    periode: Tidslinjeperiode;
    overstyringer: Overstyring[];
    skjæringstidspunkt: string;
}

export const Utbetaling: React.FC<UtbetalingProps> = React.memo(({ periode, overstyringer, skjæringstidspunkt }) => {
    const overstyringIsEnabled = useOverstyringIsEnabled();
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);
    const erAktivPeriodeISisteSkjæringstidspunkt = useErAktivPeriodeISisteSkjæringstidspunkt();

    const gjenståendeDager = useGjenståendeDager(periode.beregningId);
    const maksdato = useMaksdato(periode.beregningId);

    const dager = useTabelldagerMap({
        gjenståendeDager: gjenståendeDager,
        maksdato: maksdato,
        overstyringer: overstyringer,
        periode: periode,
    });

    return (revurderingIsEnabled || overstyringIsEnabled || overstyrRevurderingIsEnabled) &&
        erAktivPeriodeISisteSkjæringstidspunkt ? (
        <OverstyrbarUtbetaling
            fom={periode.fom}
            tom={periode.tom}
            dager={dager}
            skjæringstidspunkt={skjæringstidspunkt}
        />
    ) : (
        <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />
    );
});
