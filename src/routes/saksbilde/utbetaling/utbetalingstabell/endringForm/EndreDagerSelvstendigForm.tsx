import { ReactElement } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { DagEndringSelvstendigFormFields, lagDagEndringSelvstendigSchema } from '@form-schemas/dagEndringSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DagtypeMedAndreYtelserSelect } from '@saksbilde/utbetaling/DagTypeSelect/DagtypeMedAndreYtelserSelect';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { alleTypeendringer, overstyringsdagtyperSelvstendig } from './endringFormUtils';

interface EndreDagerFormSelvstendigProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Partial<Utbetalingstabelldag>) => void;
}

export const EndreDagerSelvstendigForm = ({
    markerteDager,
    onSubmitEndring,
}: EndreDagerFormSelvstendigProps): ReactElement => {
    const minimumGrad = markerteDager
        .values()
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.grad ?? 0), 0);

    const form = useForm<DagEndringSelvstendigFormFields>({
        resolver: zodResolver(lagDagEndringSelvstendigSchema(minimumGrad, [...markerteDager.values()])),
        defaultValues: {
            dagtype: 'MeldingTilNav',
            grad: null,
            innvigletGrad: null,
            sykepengerGrad: null,
            gradAndreYtelser: null,
            gradererAnnenYtelse: false,
        },
    });

    const watchDagtype = useWatch({ name: 'dagtype', control: form.control });
    const gradererAnnenYtelse = useWatch({ name: 'gradererAnnenYtelse', control: form.control });

    const handleSubmit = (values: DagEndringSelvstendigFormFields) => {
        onSubmitEndring({
            grad: values.gradererAnnenYtelse
                ? (values.sykepengerGrad ?? 0) + (values.gradAndreYtelser ?? 0)
                : values.grad,
            dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!,
            erAvvist: false,
            erForeldet: false,
        });
    };

    return (
        <VStack gap="space-8" paddingInline="space-32" className="[&_label]:text-base [&_label]:font-normal">
            <BodyShort weight="semibold">
                Fyll inn hva {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`}{' '}
                skal endres til
            </BodyShort>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                    <HStack gap="space-16">
                        <DagtypeMedAndreYtelserSelect
                            name="dagtype"
                            erSelvstendig={true}
                            overstyringsdagtyper={overstyringsdagtyperSelvstendig}
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
};
