import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import type { Overstyring, Vedtaksperiode } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Feilmelding } from 'nav-frontend-typografi';

import { FlexColumn } from '../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { useOverstyrRevurderingIsEnabled, useRevurderingIsEnabled } from '../../../hooks/revurdering';
import { useMap } from '../../../hooks/useMap';
import { useOverstyringIsEnabled } from '../../../hooks/useOverstyringIsEnabled';
import type { Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';
import { useGjenståendeDager, useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';
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

const FeilmeldingContainer = styled.div`
    margin-top: 1rem;
`;

const UtbetalingstabellContainer = styled(FlexColumn)`
    position: relative;
    height: 100%;
`;

const getKey = (dag: UtbetalingstabellDag) => dag.dato.format(NORSK_DATOFORMAT);

const erReellEndring = (endring: Partial<UtbetalingstabellDag>, dag: UtbetalingstabellDag): boolean =>
    Object.entries(endring).some(([key, value]: [key: keyof UtbetalingstabellDag, value: any]) => dag[key] !== value);

interface OverstyrbarUtbetalingProps {
    fom: Dayjs;
    tom: Dayjs;
    dager: Map<string, UtbetalingstabellDag>;
}

const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({ fom, tom, dager }) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();

    const vedtaksperiode = useVedtaksperiode(useAktivPeriode()?.id) as Vedtaksperiode;

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
                            />
                            {Array.from(dager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    dagtype={dag.type}
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
            {state === 'hasError' && (
                <FeilmeldingContainer>{error && <Feilmelding role="alert">{error}</Feilmelding>}</FeilmeldingContainer>
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
    return (
        <UtbetalingstabellContainer data-testid="utbetaling">
            <Utbetalingstabell fom={fom} tom={tom} dager={dager} />
        </UtbetalingstabellContainer>
    );
};

interface UtbetalingProps {
    periode: Tidslinjeperiode;
    overstyringer: Overstyring[];
}

export const Utbetaling: React.FC<UtbetalingProps> = React.memo(({ periode, overstyringer }) => {
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyringIsEnabled = useOverstyringIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);

    const gjenståendeDager = useGjenståendeDager(periode.beregningId);
    const maksdato = useMaksdato(periode.beregningId);
    const dager = useTabelldagerMap(periode, overstyringer, gjenståendeDager, maksdato);

    return revurderingIsEnabled || overstyringIsEnabled || overstyrRevurderingIsEnabled ? (
        <OverstyrbarUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />
    ) : (
        <ReadonlyUtbetaling fom={periode.fom} tom={periode.tom} dager={dager} />
    );
});
