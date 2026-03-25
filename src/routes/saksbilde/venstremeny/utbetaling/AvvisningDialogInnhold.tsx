import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, Checkbox, CheckboxGroup, Dialog, ErrorMessage, Textarea } from '@navikt/ds-react';

import { AvvisningSkjema, avvisningSkjema } from '@/form-schemas/avvisningSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { BeregnetPeriodeFragment } from '@io/graphql';
import { usePostForkasting } from '@io/rest/generated/behandlinger/behandlinger';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import { Begrunnelse } from './begrunnelse';

type AvvisningDialogInnholdProps = {
    activePeriod: BeregnetPeriodeFragment;
    onSuccess: () => void;
};

export const AvvisningDialogInnhold = ({ activePeriod, onSuccess }: AvvisningDialogInnholdProps) => {
    const router = useRouter();
    const { mutateAsync, error } = usePostForkasting();
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
    const annet = begrunnelser.includes(Begrunnelse.Annet);
    const begrunnelseValg = hentBegrunnelseValg(activePeriod);

    async function onSubmit(values: AvvisningSkjema) {
        await mutateAsync(
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
                                    legend="Årsak til at oppgaven ikke kan behandles"
                                    error={fieldState.error?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {begrunnelseValg.map((valg) => (
                                        <Checkbox key={valg.value} value={valg.value}>
                                            {valg.label}
                                        </Checkbox>
                                    ))}
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
                                    label={`Begrunnelse ${annet ? '' : '(valgfri)'}`}
                                    description={`Gi en kort forklaring på hvorfor du ikke kan behandle oppgaven.\nEksempel: Oppgave om oppfølging.\nMå ikke inneholde personopplysninger.`}
                                    minRows={6}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </form>
                </FormProvider>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.CloseTrigger>
                    <Button variant="tertiary" type="button" disabled={form.formState.isSubmitting}>
                        Avbryt
                    </Button>
                </Dialog.CloseTrigger>
                <Button variant="primary" type="submit" form="avvisning-skjema" loading={form.formState.isSubmitting}>
                    Kan ikke behandles her
                </Button>
                {error && <ErrorMessage className="self-center">En feil har oppstått</ErrorMessage>}
            </Dialog.Footer>
        </>
    );
};

type BegrunnelseValg = {
    value: string;
    label: React.ReactNode;
};

const hentBegrunnelseValg = (activePeriod: BeregnetPeriodeFragment): BegrunnelseValg[] => {
    const valg: BegrunnelseValg[] = [];

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

    for (const begrunnelse of Object.values(Begrunnelse)) {
        valg.push({ value: begrunnelse, label: begrunnelse });
    }

    return valg;
};
