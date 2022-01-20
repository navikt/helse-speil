import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Select, TextField } from '@navikt/ds-react';

import { useRevurderingIsEnabled } from '../../../../hooks/revurdering';

import { defaultUtbetalingToggles, overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';
import { Bold } from '../../../../components/Bold';

const Container = styled.div`
    background-color: var(--speil-overstyring-background);
    padding: 2rem 1rem;
    border-top: 6px solid #fff;

    label {
        font-weight: normal;
        font-size: 1rem;
    }
`;

const Dagtypevelger = styled(Select)`
    .navds-select__input {
        padding: 0.15rem;
    }
    .navds-select__container {
        margin-right: 10px;
        width: 137px;
    }
`;

const Gradvelger = styled(TextField)`
    margin-right: 0.7rem;
    width: 2.5rem;

    input {
        height: 32px;
    }

    input:disabled {
        border-color: #b8b8b8;
    }

    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    -moz-appearance: textfield;
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

const Form = styled.form`
    padding-top: 0.5rem;
`;

const dagtyperUtenGradering: Dag['type'][] = ['Arbeidsdag', 'Ferie', 'Permisjon'];

export const lovligeTypeendringer = (revurderingIsEnabled: boolean): Dag['type'][] => {
    if (revurderingIsEnabled) {
        return ['Syk', 'Ferie'];
    } else if (overstyrPermisjonsdagerEnabled) {
        return ['Syk', 'Ferie', 'Egenmelding', 'Permisjon'];
    } else {
        return ['Syk', 'Ferie', 'Egenmelding'];
    }
};

const harEndring = (endring: Partial<UtbetalingstabellDag>): boolean =>
    endring.type !== undefined || endring.gradering !== undefined;

const kanVelgeGrad = (type?: Dag['type']) => type && dagtyperUtenGradering.every((it) => it !== type);

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
        if (lovligeTypeendringer(revurderingIsEnabled).includes(event.target.value as Dag['type'])) {
            form.clearErrors('dagtype');
            const type = event.target.value as Dag['type'];
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
                <Bold>
                    Fyll inn hva{' '}
                    {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`} skal
                    endres til
                </Bold>
                <Form onSubmit={form.handleSubmit(handleSubmit)}>
                    <InputContainer>
                        <Dagtypevelger
                            size="small"
                            label="Utbet. dager"
                            onChange={oppdaterDagtype}
                            aria-invalid={form.formState.errors.dagtype}
                            error={form.formState.errors.dagtype?.message}
                            data-testid="dagtypevelger"
                        >
                            {lovligeTypeendringer(revurderingIsEnabled).map((dagtype: Dag['type']) => (
                                <option key={dagtype} value={dagtype}>
                                    {dagtype}
                                </option>
                            ))}
                        </Dagtypevelger>
                        <Gradvelger
                            size="small"
                            type="number"
                            label="Grad"
                            onChange={oppdaterGrad}
                            disabled={!kanVelgeGrad(endring.type)}
                            data-testid="gradvelger"
                            value={endring.gradering ?? ''}
                            error={form.formState.errors.gradvelger?.message}
                            {...gradvelgervalidation}
                        />
                        <Knapp
                            as="button"
                            size="small"
                            type="submit"
                            variant="secondary"
                            disabled={markerteDager.size === 0}
                            data-testid="endre"
                        >
                            Endre ({markerteDager.size})
                        </Knapp>
                    </InputContainer>
                </Form>
            </Container>
        </>
    );
};
