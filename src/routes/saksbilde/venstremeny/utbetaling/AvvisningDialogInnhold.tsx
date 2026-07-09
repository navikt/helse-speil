import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, Checkbox, CheckboxGroup, Dialog, ErrorMessage, Textarea, VStack } from '@navikt/ds-react';

import { AvvisningSkjema, avvisningSkjema } from '@/form-schemas/avvisningSkjema';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeregnetPeriodeFragment } from '@io/graphql';
import { usePostForkasting } from '@io/rest/generated/behandlinger/behandlinger';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import { ÅrsakTilAvvisning } from './årsakTilAvvisning';

type AvvisningDialogInnholdProps = {
    activePeriod: BeregnetPeriodeFragment;
    onSuccess: () => void;
};

export const AvvisningDialogInnhold = ({ activePeriod, onSuccess }: AvvisningDialogInnholdProps) => {
    const router = useRouter();
    const { mutate, isPending, error } = usePostForkasting();
    const addToast = useAddToast();
    const form = useForm<AvvisningSkjema>({
        resolver: zodResolver(avvisningSkjema),
        defaultValues: {
            begrunnelser: [],
            kommentar: '',
            årsak: 'Feil vurdering og/eller beregning',
        },
    });

    const begrunnelser = useWatch({ name: 'begrunnelser', control: form.control });
    const annet = begrunnelser.includes(ÅrsakTilAvvisning.Annet);
    const { varslerOgRiskfunn, fasteÅrsaker } = hentÅrsakerValg(activePeriod);

    function onSubmit(values: AvvisningSkjema) {
        mutate(
            {
                behandlingId: activePeriod.behandlingId,
                data: values,
            },
            {
                onSuccess: () => {
                    addToast({
                        message: 'Oppgaven er sendt til behandling i Infotrygd',
                        timeToLiveMs: 5000,
                        key: generateId(),
                        variant: 'success',
                    });
                    onSuccess();
                    router.push('/');
                },
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
                    <form onSubmit={form.handleSubmit(onSubmit)} id="avvisning-skjema">
                        <Controller
                            control={form.control}
                            name="begrunnelser"
                            render={({ field, fieldState }) => (
                                <CheckboxGroup
                                    legend="Årsak(er) til at perioden må tas ut. Velg alle relevante årsaker."
                                    error={fieldState.error?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <BodyShort>Varsler i perioden</BodyShort>
                                    {varslerOgRiskfunn.map((valg) => (
                                        <Checkbox key={valg.value} value={valg.value}>
                                            {valg.label}
                                        </Checkbox>
                                    ))}
                                    <BodyShort>og/eller andre årsaker til at perioden må tas ut</BodyShort>
                                    {fasteÅrsaker.map((valg) => (
                                        <Checkbox key={valg.value} value={valg.value}>
                                            {valg.label}
                                        </Checkbox>
                                    ))}
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
                                        label={`Begrunnelse${annet ? '' : ' (valgfri)'}`}
                                        description={
                                            <>
                                                <BodyShort>
                                                    Gi en forklaring på hvorfor perioden tas ut. Ikke oppgi
                                                    personopplysninger her.
                                                </BodyShort>
                                            </>
                                        }
                                        minRows={2}
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
                <Button variant="primary" type="submit" form="avvisning-skjema" loading={isPending}>
                    Kan ikke behandles her
                </Button>
                <BodyShort className="mt-3 italic">
                    Utviklingsteamet bruker informasjonen du gir her til å videreutvikle og forbedre Speil
                </BodyShort>
            </Dialog.Footer>
        </>
    );
};

type ÅrsakerValg = {
    value: string;
    label: React.ReactNode;
};

const hentÅrsakerValg = (activePeriod: BeregnetPeriodeFragment) => {
    const valg: ÅrsakerValg[] = [];

    const funn = activePeriod.risikovurdering?.funn;

    if (Array.isArray(funn)) {
        for (const vurderingsmoment of funn.filter((it) => !it.kategori.includes('8-4'))) {
            valg.push({ value: vurderingsmoment.beskrivelse, label: vurderingsmoment.beskrivelse });
        }
    }

    for (const varsel of activePeriod.varsler) {
        if (varsel.kode === 'SB_RV_2') {
            funn?.filter((it) => it.kategori.includes('8-4')).forEach(() => {
                valg.push({ value: varsel.tittel, label: varsel.tittel });
            });
        } else {
            valg.push({ value: varsel.tittel, label: varsel.tittel });
        }
    }

    const fasteÅrsaker: ÅrsakerValg[] = [];
    for (const årsak of Object.values(ÅrsakTilAvvisning)) {
        fasteÅrsaker.push({ value: årsak, label: årsak });
    }

    return { varslerOgRiskfunn: valg, fasteÅrsaker };
};
