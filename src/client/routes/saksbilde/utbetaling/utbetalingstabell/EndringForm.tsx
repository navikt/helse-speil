import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React, { useEffect, useState } from 'react';
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

export const shortestListLength = <T extends unknown>(lists: T[][]) =>
    lists.reduce((min, list) => (list.length < min ? list.length : min), Number.MAX_SAFE_INTEGER);

export const lovligeTypeendringer = (revurderingIsEnabled: boolean) => {
    if (revurderingIsEnabled) {
        return [Dagtype.Syk, Dagtype.Ferie];
    } else if (overstyrPermisjonsdagerEnabled) {
        return [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding, Dagtype.Permisjon];
    } else {
        return [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding];
    }
};

const harEndring = (endring: Partial<UtbetalingstabellDag>): boolean =>
    endring.type !== undefined || endring.gradering !== undefined;

const kanVelgeGrad = (type?: Dagtype) => type && dagtyperUtenGradering.every((it) => it !== type);

interface EndringFormProps {
    markerteDager: Map<string, UtbetalingstabellDag>;
    toggleOverstyring: () => void;
    onSubmitEndring: (endring: Partial<UtbetalingstabellDag>) => void;
}

export const EndringForm: React.FC<EndringFormProps> = ({ markerteDager, toggleOverstyring, onSubmitEndring }) => {
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const defaultEndring = { type: lovligeTypeendringer(revurderingIsEnabled)[0] };
    const [endring, setEndring] = useState<Partial<UtbetalingstabellDag>>(defaultEndring);

    const form = useForm();

    useEffect(() => {
        const meh = endring;
    }, [endring]);

    const { onChange: onChangeGrad, ...gradvelgervalidation } = form.register('gradvelger', {
        required: kanVelgeGrad(endring.type) && 'Velg grad',
        min: {
            value: 0,
            message: 'Grad må være over 0',
        },
        max: {
            value: 100,
            message: 'Grad må være 100 eller lavere',
        },
    });

    const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Object.values(Dagtype).includes(event.target.value as Dagtype)) {
            form.clearErrors('dagtype');
            const type = event.target.value as Dagtype;
            setEndring({ ...endring, type, gradering: kanVelgeGrad(type) ? endring.gradering : undefined });
        }
    };

    const oppdaterGrad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const gradering = Number.parseInt(event.target.value);
        setEndring({ ...endring, gradering });
        onChangeGrad(event);
    };

    const handleSubmit = () => {
        if (harEndring(endring)) {
            onSubmitEndring(endring);
            setEndring(defaultEndring);
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
                            onChange={oppdaterDagtype}
                            aria-invalid={form.formState.errors.dagtype}
                            error={form.formState.errors.dagtype?.message}
                            data-testid="dagtypevelger"
                        >
                            {lovligeTypeendringer(revurderingIsEnabled).map((dagtype: Dagtype) => (
                                <option key={dagtype} value={dagtype}>
                                    {dagtype}
                                </option>
                            ))}
                        </Dagtypevelger>
                        <Gradvelger
                            size="s"
                            type="number"
                            label="Grad"
                            onChange={oppdaterGrad}
                            disabled={!kanVelgeGrad(endring.type)}
                            data-testid="gradvelger"
                            value={endring.gradering ?? ''}
                            error={form.formState.errors.gradvelger?.message}
                            {...gradvelgervalidation}
                        />
                        <Knapp size="s" type="submit" disabled={markerteDager.size === 0} data-testid="endre">
                            Endre ({markerteDager.size})
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
