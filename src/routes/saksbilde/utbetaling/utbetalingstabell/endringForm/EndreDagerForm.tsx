import React, { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';

import { DagEndringFormFields, lagDagEndringSchema } from '@/form-schemas/dagEndringSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import { MeldingTilNavdag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { DagtypeSelect } from '../DagtypeSelect';
import {
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
} from './endringFormUtils';
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

    const overstyringsdagtyper = erSelvstendig
        ? overstyringsdagtyperSelvstendig.filter((dag) => dag !== MeldingTilNavdag)
        : overstyringsdagtyperArbeidstaker;

    const handleSubmit = (values: DagEndringFormFields) => {
        onSubmitEndring({
            grad: values.grad,
            dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!!,
            erAvvist: false,
            erForeldet: false,
        });
    };

    return (
        <div className={styles.EndringForm}>
            <BodyShort weight="semibold">
                Fyll inn hva {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`}{' '}
                skal endres til
            </BodyShort>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                    <HStack gap="4">
                        <DagtypeSelect
                            name="dagtype"
                            erSelvstendig={erSelvstendig}
                            overstyringsdagtyper={overstyringsdagtyper}
                        />
                        <GradField name="grad" kanIkkeVelgeDagtype={!kanVelgeGrad(watchDagtype)} />
                        <VStack align={'end'} justify={'end'}>
                            <Button
                                size="small"
                                type="submit"
                                variant="secondary"
                                disabled={markerteDager.size === 0}
                                data-testid="endre"
                            >
                                Endre ({markerteDager.size})
                            </Button>
                        </VStack>
                    </HStack>
                </form>
            </FormProvider>
        </div>
    );
};
