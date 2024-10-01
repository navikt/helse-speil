import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';

import { BodyShort, Button, TextField } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { DagtypeSelect } from '../DagtypeSelect';
import { OverstyrbarDagtype, alleTypeendringer, getDagFromType } from './endringFormUtils';
import { kanVelgeGrad } from './kanVelgeGrad';

import styles from './EndringForm.module.css';

const harEndring = (endring: Partial<Utbetalingstabelldag>): boolean =>
    typeof endring.dag?.speilDagtype === 'string' || typeof endring.grad === 'number';

interface EndringFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Partial<Utbetalingstabelldag>) => void;
    openDagtypeModal: () => void;
}

export const EndringForm = ({ markerteDager, onSubmitEndring, openDagtypeModal }: EndringFormProps): ReactElement => {
    const defaultEndring = { dag: alleTypeendringer[0], erAvvist: false, erForeldet: false };
    const [endring, setEndring] = useState<Partial<Utbetalingstabelldag>>(defaultEndring);

    const form = useForm();

    const { onChange: onChangeGrad, ...gradvelgervalidation } = form.register('gradvelger', {
        required: kanVelgeGrad(endring.dag?.speilDagtype) && 'Velg grad',
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
                <BodyShort weight="semibold">
                    Fyll inn hva{' '}
                    {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`} skal
                    endres til
                </BodyShort>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className={styles.Inputs}>
                        <DagtypeSelect
                            openDagtypeModal={openDagtypeModal}
                            clearErrors={() => form.clearErrors('dagtype')}
                            errorMessage={form.formState.errors?.dagtype?.message?.toString()}
                            setType={(type: OverstyrbarDagtype) =>
                                setEndring({
                                    ...endring,
                                    dag: getDagFromType(type),
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
                            disabled={!kanVelgeGrad(endring.dag?.speilDagtype)}
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
