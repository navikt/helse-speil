import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, TextField } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

import { DagtypeSelect } from '../DagtypeSelect';
import { OverstyrbarDagtype, alleTypeendringer } from './endringFormUtils';
import { kanVelgeGrad } from './kanVelgeGrad';

import styles from './EndringForm.module.css';

const harEndring = (endring: Partial<UtbetalingstabellDag>): boolean =>
    typeof endring.type === 'string' || typeof endring.grad === 'number';

interface EndringFormProps {
    markerteDager: Map<string, UtbetalingstabellDag>;
    onSubmitEndring: (endring: Partial<UtbetalingstabellDag>) => void;
}

export const EndringForm: React.FC<EndringFormProps> = ({ markerteDager, onSubmitEndring }) => {
    const defaultEndring = { type: alleTypeendringer[0] };
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

    const oppdaterGrad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const grad = Number.parseInt(event.target.value);
        setEndring({ ...endring, grad });
        onChangeGrad(event);
    };

    const handleSubmit = () => {
        if (harEndring(endring)) {
            onSubmitEndring(endring);
            setEndring((prevState) => ({ ...prevState, grad: undefined }));
        } else {
            form.setError('dagtype', { message: 'Velg en dagtype' });
        }
    };

    return (
        <>
            <div className={styles.EndringForm}>
                <Bold>
                    Fyll inn hva{' '}
                    {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`} skal
                    endres til
                </Bold>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className={styles.Inputs}>
                        <DagtypeSelect
                            clearErrors={() => form.clearErrors('dagtype')}
                            errorMessage={form.formState.errors?.dagtype?.message?.toString()}
                            setType={(type: OverstyrbarDagtype) =>
                                setEndring({
                                    ...endring,
                                    type,
                                    grad: kanVelgeGrad(type) ? endring.grad : undefined,
                                })
                            }
                        />
                        <TextField
                            className={styles.Gradvelger}
                            size="small"
                            type="number"
                            label="Grad"
                            onChange={oppdaterGrad}
                            disabled={!kanVelgeGrad(endring.type)}
                            data-testid="gradvelger"
                            value={typeof endring.grad === 'number' ? `${endring.grad}` : ''}
                            error={
                                form.formState.errors.gradvelger ? (
                                    <>{form.formState.errors.gradvelger.message}</>
                                ) : null
                            }
                            {...gradvelgervalidation}
                        />
                        <Button
                            size="small"
                            type="submit"
                            variant="secondary"
                            disabled={markerteDager.size === 0}
                            data-testid="endre"
                        >
                            Endre ({markerteDager.size})
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
