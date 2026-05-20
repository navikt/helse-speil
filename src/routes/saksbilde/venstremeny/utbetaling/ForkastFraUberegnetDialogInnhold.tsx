import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    Button,
    Checkbox,
    CheckboxGroup,
    Dialog,
    ErrorMessage,
    HStack,
    Skeleton,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { ForkastingSkjema, forkastingSkjema } from '@/form-schemas/forkastingSkjema';
import { Arsak, useArsaker } from '@external/sanity';
import { zodResolver } from '@hookform/resolvers/zod';
import { UberegnetPeriodeFragment } from '@io/graphql';
import { usePostForkasting } from '@io/rest/generated/behandlinger/behandlinger';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
    visningenOppdateresToastKey,
} from '@state/oppdateringToasts';
import { useAddToast, useRemoveToast } from '@state/toasts';

type ForkastFraUberegnetDialogInnholdProps = {
    activePeriod: UberegnetPeriodeFragment;
    onSuccess: () => void;
};

export const ForkastFraUberegnetDialogInnhold = ({
    activePeriod,
    onSuccess,
}: ForkastFraUberegnetDialogInnholdProps) => {
    const { mutate, isPending, error } = usePostForkasting();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const { arsaker, loading: arsakerLoading } = useArsaker('forkastingarsaker');
    const form = useForm<ForkastingSkjema>({
        resolver: zodResolver(forkastingSkjema),
        defaultValues: {
            arsaker: [],
            kommentar: '',
        },
    });

    const arsakerValue = useWatch({ name: 'arsaker', control: form.control });
    const harValgtAnnet = arsakerValue.some((it) => JSON.parse(it).arsak === 'Annet');

    function onSubmit(values: ForkastingSkjema) {
        const parsedArsaker: Arsak[] = values.arsaker.map((it) => JSON.parse(it));
        addToast(visningenOppdateresToast({}));
        mutate(
            {
                behandlingId: activePeriod.behandlingId,
                data: {
                    årsak: 'Feil vurdering og/eller beregning',
                    begrunnelser: parsedArsaker.map((it) => it.arsak),
                    kommentar: values.kommentar.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    removeToast(visningenOppdateresToastKey);
                    addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
                    onSuccess();
                },
                onError: () => removeToast(visningenOppdateresToastKey),
            },
        );
    }

    return (
        <>
            <Dialog.Header>
                <Dialog.Title>Kan ikke behandles her</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="forkast-fra-uberegnet-skjema">
                        <Controller
                            control={form.control}
                            name="arsaker"
                            render={({ field, fieldState }) => (
                                <CheckboxGroup
                                    legend="Årsak til at perioden må tas ut"
                                    error={fieldState.error?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {!arsakerLoading &&
                                        arsaker[0]?.arsaker.map((årsak: Arsak) => (
                                            <Checkbox key={årsak._key} value={JSON.stringify(årsak)}>
                                                {årsak.arsak}
                                            </Checkbox>
                                        ))}
                                    {arsakerLoading && (
                                        <VStack gap="space-4" className="w-1/2">
                                            {Array.from({ length: 6 }, (_, index) => (
                                                <HStack key={`skeleton${index}`} gap="space-16" align="center">
                                                    <Skeleton variant="rectangle" width="1.5rem" height="1.5rem" />
                                                    <Skeleton variant="text" height="2.5rem" width="100%" />
                                                </HStack>
                                            ))}
                                        </VStack>
                                    )}
                                </CheckboxGroup>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="kommentar"
                            render={({ field, fieldState }) => (
                                <Textarea
                                    {...field}
                                    name="kommentar"
                                    label={`Begrunnelse ${harValgtAnnet ? '' : '(valgfri)'}`}
                                    description="Gi en forklaring på hvorfor perioden tas ut."
                                    minRows={6}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </form>
                </FormProvider>
            </Dialog.Body>
            <Dialog.Footer>
                {error && <ErrorMessage className="mr-auto self-center">En feil har oppstått</ErrorMessage>}
                <Dialog.CloseTrigger>
                    <Button variant="tertiary" type="button" disabled={isPending}>
                        Avbryt
                    </Button>
                </Dialog.CloseTrigger>
                <Button variant="primary" type="submit" form="forkast-fra-uberegnet-skjema" loading={isPending}>
                    Kan ikke behandles her
                </Button>
            </Dialog.Footer>
        </>
    );
};
