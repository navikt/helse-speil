import { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    Alert,
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Dialog,
    ErrorMessage,
    HStack,
    List,
    Skeleton,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';

import { AnnulleringSkjema, annulleringSkjema } from '@/form-schemas/annulleringSkjema';
import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arsak, useArsaker } from '@external/sanity';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { usePostVedtaksperiodeAnnuller } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';
import { somNorskDato } from '@utils/date';

import { useTotaltUtbetaltForSykefraværstilfellet } from './annullering';

interface AnnulleringsDialogInnholdProps {
    inntektsforholdReferanse: InntektsforholdReferanse;
    vedtaksperiodeId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    onSuccess: () => void;
}

export function AnnulleringsDialogInnhold({
    inntektsforholdReferanse,
    vedtaksperiodeId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    person,
    periode,
    onSuccess,
}: AnnulleringsDialogInnholdProps): ReactElement {
    const { mutateAsync, error } = usePostVedtaksperiodeAnnuller();
    const erINyesteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);
    const addToast = useAddToast();
    const { arsaker, loading: arsakerLoading } = useArsaker('annulleringsarsaker');

    const form = useForm<AnnulleringSkjema>({
        resolver: zodResolver(annulleringSkjema),
        defaultValues: {
            arsaker: [],
            kommentar: '',
            arbeidsgiverFagsystemId,
            personFagsystemId,
        },
    });

    const arsakerValue = useWatch({ name: 'arsaker', control: form.control });
    const harValgtAnnet = arsakerValue.some((it) => JSON.parse(it).arsak === 'Annet');

    async function onSubmit(values: AnnulleringSkjema) {
        const parsedArsaker: Arsak[] = values.arsaker.map((it) => JSON.parse(it));
        await mutateAsync(
            {
                vedtaksperiodeId,
                data: {
                    årsaker: parsedArsaker.map((it) => ({ key: it._key, årsak: it.arsak })),
                    kommentar: values.kommentar.trim() || undefined,
                    arbeidsgiverFagsystemId: values.arbeidsgiverFagsystemId,
                    personFagsystemId: values.personFagsystemId,
                },
            },
            {
                onSuccess: () => {
                    addToast({
                        message: 'Annulleringen er sendt',
                        timeToLiveMs: 5000,
                        key: 'annullering',
                    });
                    onSuccess();
                },
            },
        );
    }

    return (
        <Dialog.Popup width="large">
            <Dialog.Header>
                <Dialog.Title>Annullering</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="annullerings-skjema">
                        <Annulleringsinformasjon
                            person={person}
                            periode={periode}
                            inntektsforholdReferanse={inntektsforholdReferanse}
                        />
                        <VStack gap="space-16">
                            <Alert variant="info">
                                Årsakene og begrunnelsen du fyller ut her, finner du ikke igjen i Speil etterpå.
                                <br />
                                Informasjonen brukes til å forbedre løsningen.
                            </Alert>
                            <Controller
                                control={form.control}
                                name="arsaker"
                                render={({ field, fieldState }) => (
                                    <CheckboxGroup
                                        legend="Hvorfor kunne ikke vedtaket revurderes?"
                                        error={fieldState.error?.message}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        {!arsakerLoading &&
                                            arsaker[0]?.arsaker.map((årsak) => (
                                                <Checkbox key={årsak._key} value={JSON.stringify(årsak)}>
                                                    {årsak.arsak}
                                                </Checkbox>
                                            ))}
                                        {arsakerLoading && (
                                            <VStack gap="space-4" className="w-1/2">
                                                {Array.from({ length: 20 }, (_, index) => (
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
                                        description={`Gi en kort forklaring på hvorfor du annullerte.\nEksempel: Korrigerte opplysninger om ferie`}
                                        minRows={6}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </VStack>
                        {!erINyesteSkjæringstidspunkt && (
                            <BodyShort className="mb-5">
                                Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne,
                                men om den ikke er den nyeste vil den ikke bli annullert.
                            </BodyShort>
                        )}
                    </form>
                </FormProvider>
            </Dialog.Body>
            <Dialog.Footer>
                {error && (
                    <ErrorMessage className="mr-auto self-center">
                        Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                    </ErrorMessage>
                )}
                <Dialog.CloseTrigger>
                    <Button variant="tertiary" type="button" disabled={form.formState.isSubmitting}>
                        Avbryt
                    </Button>
                </Dialog.CloseTrigger>
                <Button
                    variant="primary"
                    type="submit"
                    form="annullerings-skjema"
                    loading={form.formState.isSubmitting}
                >
                    Annuller
                </Button>
            </Dialog.Footer>
        </Dialog.Popup>
    );
}

function Annulleringsinformasjon({
    person,
    periode,
    inntektsforholdReferanse,
}: {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    inntektsforholdReferanse: InntektsforholdReferanse;
}): ReactElement | null {
    const { totalbeløp, førsteUtbetalingsdag, sisteUtbetalingsdag } = useTotaltUtbetaltForSykefraværstilfellet(person);

    if (!førsteUtbetalingsdag && !sisteUtbetalingsdag && !totalbeløp) return null;

    const kandidater = periode.annulleringskandidater.map((kandidat) => ({
        fom: kandidat.fom,
        tom: kandidat.tom,
    }));

    return (
        <div className="mb-8">
            <Box paddingBlock="space-0 space-16">
                <Alert variant="info">
                    Når en periode annulleres, vil overlappende og etterfølgende perioder som det ikke har vært fattet
                    vedtak på, bli tatt ut av Speil.
                </Alert>
            </Box>
            <HStack gap="space-8" paddingBlock="space-8">
                <Inntektsforholdnavn
                    inntektsforholdReferanse={inntektsforholdReferanse}
                    maxWidth="190px"
                    weight="semibold"
                />
                {inntektsforholdReferanse.type === 'Arbeidsgiver' && (
                    <AnonymizableText weight="semibold">
                        {inntektsforholdReferanse.organisasjonsnummer}
                    </AnonymizableText>
                )}
            </HStack>
            <BodyShort>Utbetalingene for følgende perioder annulleres</BodyShort>
            <List as="ul" size="small">
                {kandidater.map((kandidat) => (
                    <ListItem key={`annulleringsperiode-${kandidat.fom}-${kandidat.tom}`}>
                        {somNorskDato(kandidat.fom)} - {somNorskDato(kandidat.tom)}
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
