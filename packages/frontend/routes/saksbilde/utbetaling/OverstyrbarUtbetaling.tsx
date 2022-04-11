import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { FormProvider, useForm } from 'react-hook-form';
import { Unlocked } from '@navikt/ds-icons';

import { Bold } from '@components/Bold';
import { Flex, FlexColumn } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { Utbetaling, Utbetalingstatus } from '@io/graphql';
import { useMap } from '@hooks/useMap';

import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';
import { ToggleOverstyringKnapp, UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { EndringForm } from './utbetalingstabell/EndringForm';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { BodyShort } from '@navikt/ds-react';

const Container = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    padding-right: ${(props) => (props.overstyrer ? '1rem' : '2rem')};
    margin-left: ${(props) => (props.overstyrer ? '0.5rem' : '0')};
    border-left: ${(props) => (props.overstyrer ? '6px solid #0067C5' : '0')};
    margin-top: 1rem;
`;

const UtbetalingstabellContainer = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    height: 100%;
    padding-top: 2rem;
    background-color: ${(props) => (props.overstyrer ? 'var(--speil-overstyring-background)' : 'inherit')};
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

const Feilmelding = styled(BodyShort)`
    margin-left: 2rem;
    color: var(--navds-color-text-error);
    font-weight: 600;
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
    utbetaling: Utbetaling;
    revurderingIsEnabled: boolean;
    overstyrRevurderingIsEnabled: boolean;
}

export const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({
    fom,
    tom,
    dager,
    skjæringstidspunkt,
    utbetaling,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();

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
            new Map(overstyrteDager),
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
                    periodeErForkastet={utbetaling.status === Utbetalingstatus.Forkastet}
                    toggleOverstyring={toggleOverstyring}
                    dager={dager}
                    revurderingIsEnabled={revurderingIsEnabled}
                    overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
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
                                revurderingIsEnabled={revurderingIsEnabled}
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
