import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Select, TextField } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { erDev, erLocal } from '@utils/featureToggles';

import styles from './EndringForm.module.css';

const dagtyperUtenGradering: Array<Utbetalingstabelldagtype> = ['Arbeid', 'Ferie', 'Permisjon', 'Avslått'];

type GetLovligeTypeendringerOptions = {
    revurderingIsEnabled?: boolean;
};

export const getLovligeTypeendringer = ({
    revurderingIsEnabled,
}: GetLovligeTypeendringerOptions = {}): Array<Utbetalingstabelldagtype> => {
    if (erDev() || erLocal()) return ['Syk', 'Ferie', 'Egenmelding', 'Permisjon', 'Arbeid'];
    if (revurderingIsEnabled) {
        return ['Syk', 'Ferie'];
    } else {
        return ['Syk', 'Ferie', 'Egenmelding', 'Permisjon'];
    }
};

const harEndring = (endring: Partial<UtbetalingstabellDag>): boolean =>
    typeof endring.type === 'string' || typeof endring.grad === 'number';

const kanVelgeGrad = (type?: Utbetalingstabelldagtype) => type && dagtyperUtenGradering.every((it) => it !== type);

interface EndringFormProps {
    markerteDager: Map<string, UtbetalingstabellDag>;
    onSubmitEndring: (endring: Partial<UtbetalingstabellDag>) => void;
    revurderingIsEnabled?: boolean;
}

export const EndringForm: React.FC<EndringFormProps> = ({
    markerteDager,
    onSubmitEndring,
    revurderingIsEnabled = false,
}) => {
    const defaultEndring = { type: getLovligeTypeendringer({ revurderingIsEnabled })[0] };
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
        if (
            getLovligeTypeendringer({ revurderingIsEnabled }).includes(event.target.value as Utbetalingstabelldagtype)
        ) {
            form.clearErrors('dagtype');
            const type = event.target.value as Utbetalingstabelldagtype;
            setEndring({ ...endring, type, grad: kanVelgeGrad(type) ? endring.grad : undefined });
        }
    };

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
                        <Select
                            className={styles.Dagtypevelger}
                            size="small"
                            label="Utbet. dager"
                            onChange={oppdaterDagtype}
                            aria-invalid={form.formState.errors.dagtype}
                            error={form.formState.errors.dagtype?.message}
                            data-testid="dagtypevelger"
                        >
                            {getLovligeTypeendringer({ revurderingIsEnabled }).map((dagtype) => (
                                <option key={dagtype} value={dagtype}>
                                    {dagtype}
                                </option>
                            ))}
                        </Select>
                        <TextField
                            className={styles.Gradvelger}
                            size="small"
                            type="number"
                            label="Grad"
                            onChange={oppdaterGrad}
                            disabled={!kanVelgeGrad(endring.type)}
                            data-testid="gradvelger"
                            value={typeof endring.grad === 'number' ? `${endring.grad}` : ''}
                            error={form.formState.errors.gradvelger?.message}
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
