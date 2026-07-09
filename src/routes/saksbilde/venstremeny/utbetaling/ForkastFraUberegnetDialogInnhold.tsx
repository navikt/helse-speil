import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    BodyLong,
    BodyShort,
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
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { Arsak, useArsaker } from '@external/sanity';
import { zodResolver } from '@hookform/resolvers/zod';
import { UberegnetPeriodeFragment } from '@io/graphql';
import { usePostAnmodOmForkasting } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';
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
    const { mutate, isPending, error } = usePostAnmodOmForkasting();
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
                vedtaksperiodeId: activePeriod.vedtaksperiodeId,
                data: {
                    årsaker: parsedArsaker.map((it) => ({ key: it._key, årsak: it.arsak })),
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
                        <BodyLong className="mb-4">
                            Sjekk siden{' '}
                            <a
                                style={{ textDecoration: 'underline' }}
                                href="https://navno.sharepoint.com/sites/44/NAYsykepenger/_layouts/15/Doc.aspx?sourcedoc=%7Beedf26b9-2095-46bd-84ab-88859718061d%7D&action=view&wd=target%28Funksjoner.one%7C0a6ddbc7-1220-4da4-9cf8-096fffdb6235%2FAvvise%20periode%20til%20behandling%7C5f256a79-3927-4415-a118-89110a74df46%2F%29&wdorigin=703&wdpartid=%7B61237749-eaa9-0657-1917-a3175e3ae8c4%7D%7B1%7D&wdsectionfileid=%7B50933618-b447-404b-8ca1-6b558a6b51ad%7D"
                                target="_blank"
                            >
                                Avvise periode til behandling i Speilboka
                            </a>{' '}
                            for å se om denne saken kan beholdes i Speil.
                        </BodyLong>
                        <Controller
                            control={form.control}
                            name="arsaker"
                            render={({ field, fieldState }) => (
                                <CheckboxGroup
                                    legend="Årsak(er) til at perioden må tas ut"
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
                        <VStack align="start" gap="space-8" className="mt-4">
                            <VisesIkkeIVedtakTag />
                            <Controller
                                control={form.control}
                                name="kommentar"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        name="kommentar"
                                        label={`Begrunnelse${harValgtAnnet ? '' : ' (valgfri)'}`}
                                        description={
                                            <>
                                                <BodyShort>
                                                    Gi en forklaring på hvorfor perioden tas ut. Ikke oppgi
                                                    personopplysninger her.
                                                </BodyShort>
                                            </>
                                        }
                                        minRows={6}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </VStack>
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
                <BodyShort className="mt-3 italic">
                    Utviklingsteamet bruker informasjonen du gir her til å videreutvikle og forbedre Speil
                </BodyShort>
            </Dialog.Footer>
        </>
    );
};
