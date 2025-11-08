import React, { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button } from '@navikt/ds-react';

import { DagEndringFormFields, lagDagEndringSchema } from '@/form-schemas/dagEndringSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { DagtypeSelect } from '../DagtypeSelect';
import { alleTypeendringer } from './endringFormUtils';
import { kanVelgeGrad } from './kanVelgeGrad';

import styles from './EndringForm.module.css';

interface EndringFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Partial<Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const EndreDagerForm = ({ markerteDager, onSubmitEndring, erSelvstendig }: EndringFormProps): ReactElement => {
    const minimumGrad = markerteDager
        .values()
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.grad ?? 0), 0);

    const form = useForm<DagEndringFormFields>({
        resolver: zodResolver(lagDagEndringSchema(minimumGrad)),
        defaultValues: {
            dagtype: 'Syk',
            grad: 100,
        },
    });

    const watchDagtype = form.watch('dagtype');

    const handleSubmit = (values: DagEndringFormFields) => {
        onSubmitEndring({
            grad: values.grad,
            dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!!,
            erAvvist: false,
            erForeldet: false,
        });
    };

    return (
        <>
            <div className={styles.EndringForm}>
                <BodyShort weight="semibold">
                    Fyll inn hva{' '}
                    {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`} skal
                    endres til
                </BodyShort>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                        <div className={styles.Inputs}>
                            <DagtypeSelect name="dagtype" erSelvstendig={erSelvstendig} />
                            <GradField name="grad" kanIkkeVelgeDagtype={!kanVelgeGrad(watchDagtype)} />
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
                </FormProvider>
            </div>
        </>
    );
};
