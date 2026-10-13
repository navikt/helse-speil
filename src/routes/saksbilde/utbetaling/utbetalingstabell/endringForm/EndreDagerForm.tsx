import React, { ReactElement } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DagtypeMedAndreYtelserSelect } from '@saksbilde/utbetaling/DagTypeSelect/DagtypeMedAndreYtelserSelect';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';

import { lagSchema, lagStandardverdier, overstyringsdagtyper, tilDagendring } from './endreDagerUtils';
import type { DagEndringFormFields, EndreDagerFormProps } from './types';

export function EndreDagerForm({ markerteDager, onSubmitEndring, erSelvstendig }: EndreDagerFormProps): ReactElement {
    const form = useForm<DagEndringFormFields>({
        resolver: zodResolver(lagSchema(erSelvstendig, markerteDager)),
        defaultValues: lagStandardverdier(erSelvstendig),
    });

    const watchDagtype = useWatch({ name: 'dagtype', control: form.control });
    const gradererAnnenYtelse = useWatch({ name: 'gradererAnnenYtelse', control: form.control });

    return (
        <VStack gap="space-8" paddingInline="space-32" className="[&_label]:text-base [&_label]:font-normal">
            <BodyShort weight="semibold">
                Fyll inn hva {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`}{' '}
                skal endres til
            </BodyShort>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit((values) => onSubmitEndring(tilDagendring(values)))}
                    autoComplete="off"
                >
                    <HStack gap="space-16">
                        <DagtypeMedAndreYtelserSelect
                            name="dagtype"
                            erSelvstendig={erSelvstendig}
                            overstyringsdagtyper={overstyringsdagtyper(erSelvstendig)}
                            hideError
                        />
                        {!gradererAnnenYtelse && (
                            <GradField name="grad" kanIkkeVelgeDagtype={!kanVelgeGrad(watchDagtype)} hideError />
                        )}
                        <VStack align="end" justify="end">
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
                    <VStack paddingBlock="space-8 space-0">
                        {form.formState.errors.dagtype?.message && (
                            <ErrorMessage size="small" showIcon>
                                Dagtype: {form.formState.errors.dagtype.message as string}
                            </ErrorMessage>
                        )}
                        {form.formState.errors.grad?.message && (
                            <ErrorMessage size="small" showIcon>
                                Grad: {form.formState.errors.grad.message as string}
                            </ErrorMessage>
                        )}
                    </VStack>
                </form>
            </FormProvider>
        </VStack>
    );
}
