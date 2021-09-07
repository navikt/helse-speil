import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Unlocked } from '@navikt/ds-icons';
import { Button, Select, TextField } from '@navikt/ds-react';

import { useRevurderingIsEnabled } from '../../../../hooks/useRevurderingIsEnabled';

import { defaultUtbetalingToggles, overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { ToggleOverstyringKnapp } from './ToggleOverstyringKnapp';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled.div`
    background-color: var(--navds-color-gray-10);
    padding: 2rem;

    label {
        font-weight: normal;
        font-size: 1rem;
    }
`;

const Dagtypevelger = styled(Select)`
    .navds-select__container {
        margin-right: 10px;
        width: 137px;
    }
`;

const Gradvelger = styled(TextField)`
    margin-right: 20px;
    width: 57px;

    input {
        height: 32px;
    }

    input:disabled {
        border-color: #b8b8b8;
    }
`;

const Knapp = styled(Button)`
    margin-top: 24px;
    margin-right: 10px;
    font-size: 1rem;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: start;
`;

const dagtyperUtenGradering = [Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon];

const lovligeRevurderinger: ReadonlyMap<Dagtype, Array<Dagtype>> = new Map([
    [Dagtype.Syk, [Dagtype.Syk, Dagtype.Ferie]],
    [Dagtype.Ferie, [Dagtype.Syk, Dagtype.Ferie]],
]);

const lovligeOverstyringer: ReadonlyMap<Dagtype, Array<Dagtype>> = new Map([
    [Dagtype.Syk, [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding, Dagtype.Permisjon]],
    [Dagtype.Ferie, [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding, Dagtype.Permisjon]],
    [Dagtype.Egenmelding, [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding, Dagtype.Permisjon]],
    [
        Dagtype.Permisjon,
        overstyrPermisjonsdagerEnabled ? [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding, Dagtype.Permisjon] : [],
    ],
]);

export const shortestListLength = <T extends unknown>(lists: T[][]) =>
    lists.reduce((min, list) => (list.length < min ? list.length : min), Number.MAX_SAFE_INTEGER);

export const lovligeTypeendringer = (typer: Dagtype[], revurderingIsEnabled: boolean) => {
    const lovligeTyperMap = revurderingIsEnabled ? lovligeRevurderinger : lovligeOverstyringer;
    const muligeTypeendringer = typer.map((it) => lovligeTyperMap.get(it) ?? []) as Dagtype[][];
    const kortesteListelengde = shortestListLength<Dagtype>(muligeTypeendringer);
    return muligeTypeendringer[0].slice(0, kortesteListelengde);
};

const getDistinctValues = <K extends unknown, T extends K[keyof K]>(dager: Map<string, K>, property: keyof K): T[] => {
    const values = Array.from(dager.values()).map((it) => it[property]);
    return Array.from(new Set(values)) as T[];
};

const getDistinctDagtyper = (dager: Map<string, UtbetalingstabellDag>) =>
    getDistinctValues<UtbetalingstabellDag, Dagtype>(dager, 'type');

const getDistinctGrader = (dager: Map<string, UtbetalingstabellDag>) =>
    getDistinctValues<UtbetalingstabellDag, number>(dager, 'gradering');

const singularValueOrUndefined = <T extends unknown>(list: T[]): T | undefined =>
    list.length === 1 ? list[0] : undefined;

const harEndring = (endring: Partial<UtbetalingstabellDag>): boolean =>
    endring.type !== undefined || endring.gradering !== undefined;

const joinMaps = <K, V>(to: Map<K, V>, from: Map<K, V>): Map<K, V> =>
    Array.from(from.entries())
        .filter(([key]) => to.get(key) !== undefined)
        .reduce((map, [key, value]) => map.set(key, value), new Map<K, V>(to));

interface EndringFormProps {
    markerteDager: Map<string, UtbetalingstabellDag>;
    overstyrteDager: Map<string, UtbetalingstabellDag>;
    toggleOverstyring: () => void;
    onSubmitEndring: (endring: Partial<UtbetalingstabellDag>) => void;
}

export const EndringForm: React.FC<EndringFormProps> = ({
    markerteDager,
    overstyrteDager,
    toggleOverstyring,
    onSubmitEndring,
}) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [endring, setEndring] = useState<Partial<UtbetalingstabellDag>>({});

    const dager = useMemo(() => joinMaps(markerteDager, overstyrteDager), [markerteDager, overstyrteDager]);
    const markerteDagtyper = useMemo(() => getDistinctDagtyper(dager), [dager]);
    const markerteGrader = useMemo(() => getDistinctGrader(dager), [dager]);

    useEffect(() => {
        setEndring((endring) => ({ ...endring, type: singularValueOrUndefined(markerteDagtyper) }));
    }, [markerteDagtyper]);

    useEffect(() => {
        setEndring((endring) => ({ ...endring, gradering: singularValueOrUndefined(markerteGrader) }));
    }, [markerteGrader]);

    const harMarkerteDager = dager.size > 0;

    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);

    const kanVelgeGrad = endring.type
        ? dagtyperUtenGradering.every((type) => type !== endring.type)
        : dagtyperUtenGradering.every((type) => !markerteDagtyper.includes(type));

    const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Object.values(Dagtype).includes(event.target.value as Dagtype)) {
            form.clearErrors('dagtype');
            setEndring((prevState) => ({ ...prevState, type: event.target.value as Dagtype }));
        }
    };

    const oppdaterGrad = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndring((prevState) => ({ ...prevState, gradering: Number(event.target.value) }));
    };

    const handleSubmit = () => {
        if (harEndring(endring)) {
            onSubmitEndring(endring);
            setEndring({});
        } else {
            form.setError('dagtype', { message: 'Velg en dagtype' });
        }
    };

    return (
        <>
            <Container>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <InputContainer>
                        <Dagtypevelger
                            size="s"
                            label="Utbet. dager"
                            value={endring.type ?? ''}
                            disabled={!harMarkerteDager}
                            onChange={oppdaterDagtype}
                            aria-invalid={form.formState.errors.dagtype}
                            error={form.formState.errors.dagtype?.message}
                        >
                            {harMarkerteDager &&
                                lovligeTypeendringer(markerteDagtyper, revurderingIsEnabled).map((dagtype: Dagtype) => (
                                    <option key={dagtype} data-testid="overstyrbar-dagtype-option">
                                        {dagtype}
                                    </option>
                                ))}
                            <option disabled label="-" />
                        </Dagtypevelger>
                        <Gradvelger
                            size="s"
                            type="number"
                            label="Grad"
                            onBlur={oppdaterGrad}
                            disabled={!kanVelgeGrad || !harMarkerteDager}
                            defaultValue={endring.gradering}
                        />
                        <Knapp size="s" type="submit" disabled={!harMarkerteDager}>
                            Endre
                        </Knapp>
                        <ToggleOverstyringKnapp type="button" onClick={toggleOverstyring}>
                            <Unlocked height={24} width={24} />
                            Avbryt
                        </ToggleOverstyringKnapp>
                    </InputContainer>
                </form>
            </Container>
        </>
    );
};
