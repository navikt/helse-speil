import { useParams } from 'next/navigation';
import { ReactElement, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    BodyShort,
    Button,
    ErrorMessage,
    HStack,
    InlineMessage,
    Label,
    Radio,
    RadioGroup,
    VStack,
} from '@navikt/ds-react';

import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import {
    OppholdskravSchema,
    aktuelleSpørsmål,
    girIkkeOppfylt,
    girOppfylt,
    oppholdskravDefaultValues,
    oppholdskravSkjema,
    tilOppholdskravRequest,
    unntakAndreLeddLabels,
} from '@form-schemas/oppholdskravSkjema';
import { JaNei } from '@form-schemas/opptjeningsvurderingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiUnntakAndreLedd } from '@io/rest/generated/avslagsdager/avslagsdager.schemas';
import {
    PostOppholdskravvurderingBehandlerMutationError,
    usePostOppholdskravvurderingBehandler,
} from '@io/rest/generated/avslagsdager/vurderinger/vurderinger';
import { getGetSaksbehandlerhandlingerForPersonQueryKey } from '@io/rest/generated/personer/personer';
import {
    dagenEllerDagene,
    dagerAvslåttForSenMeldingTilNav,
    somDagliste,
} from '@saksbilde/utbetaling/utbetalingstabell/oppholdskravSperrer';
import { BegrunnelseOgJournalpost } from '@saksbilde/vilkår/opptjening/BegrunnelseOgJournalpost';
import { visningenOppdateresToast } from '@state/oppdateringToasts';
import { useAddToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface OppholdskravSkjemaProps {
    behandlingId: string;
    markerteDager: Map<string, Utbetalingstabelldag>;
    onLukk: () => void;
    onLagret: () => void;
}

// Foreløpig skjema for å teste flyten i dev. Byttes når skissene for § 8-9 er klare (navikt/sas-issues#98).
export function OppholdskravSkjema({
    behandlingId,
    markerteDager,
    onLukk,
    onLagret,
}: OppholdskravSkjemaProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const addToast = useAddToast();
    const [, setVisningenOppdateres] = useVisningenOppdateresState();
    const dager = useMemo(() => Array.from(markerteDager.keys()).sort(), [markerteDager]);
    const sperre = finnSperre(Array.from(markerteDager.values()));

    const form = useForm<OppholdskravSchema>({
        resolver: zodResolver(oppholdskravSkjema),
        defaultValues: oppholdskravDefaultValues(dager),
    });
    const svar = useWatch({ control: form.control });
    const aktuelle = aktuelleSpørsmål(svar);

    useEffect(() => {
        form.setValue('dager', dager, { shouldValidate: form.formState.isSubmitted });
    }, [dager, form]);

    const { mutate, isPending, error } = usePostOppholdskravvurderingBehandler({
        mutation: {
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: getGetSaksbehandlerhandlingerForPersonQueryKey(personPseudoId),
                });
                // «Visningen er oppdatert» vises av useOverstyrDager når Spleis har revurdert
                setVisningenOppdateres(true);
                addToast(visningenOppdateresToast({}));
                onLagret();
            },
        },
    });

    function onSubmit(skjema: OppholdskravSchema) {
        if (sperre) return;
        mutate({ personId: personPseudoId, data: tilOppholdskravRequest(skjema, behandlingId) });
    }

    return (
        <FormProvider {...form}>
            <VStack
                as="form"
                marginInline="space-32"
                paddingBlock="space-16"
                gap="space-20"
                className="border-t border-ax-border-neutral-subtle"
                onSubmit={form.handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <VStack gap="space-4">
                    <Label size="small" as="p">
                        Dager
                    </Label>
                    <BodyShort size="small">
                        {dager.length > 0 ? somDagliste(dager) : 'Marker dagene som skal vurderes.'}
                    </BodyShort>
                    {form.formState.errors.dager?.message && (
                        <ErrorMessage size="small">{form.formState.errors.dager.message}</ErrorMessage>
                    )}
                    {sperre && <ErrorMessage size="small">{sperre}</ErrorMessage>}
                </VStack>
                <JaNeiSpørsmål name="eøsBorger" legend="Er personen EØS-borger?" />
                <JaNeiSpørsmål
                    name="oppholdIGodkjentOmråde"
                    legend={
                        svar.eøsBorger === JaNei.NEI
                            ? 'Oppholdt personen seg i Norge?'
                            : 'Oppholdt personen seg i Norge, et annet EØS-land eller et avtaleland?'
                    }
                />
                {aktuelle.unntakAndreLedd && (
                    <Controller
                        control={form.control}
                        name="unntakAndreLedd"
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                {...field}
                                value={field.value ?? null}
                                legend="Gjelder et av unntakene i andre ledd?"
                                size="small"
                                error={fieldState.error?.message}
                            >
                                {Object.values(ApiUnntakAndreLedd).map((unntak) => (
                                    <Radio key={unntak} value={unntak}>
                                        {unntakAndreLeddLabels[unntak]}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />
                )}
                {aktuelle.godkjentOppholdInntilFireUker && (
                    <JaNeiSpørsmål
                        name="godkjentOppholdInntilFireUker"
                        legend="Har Nav godkjent oppholdet utenfor Norge i inntil fire uker?"
                    />
                )}
                {girOppfylt(svar) && <InlineMessage status="success">Vilkåret er oppfylt</InlineMessage>}
                {girIkkeOppfylt(svar) && <InlineMessage status="warning">Vilkåret er ikke oppfylt</InlineMessage>}
                <BegrunnelseOgJournalpost />
                <HStack gap="space-8">
                    <ButtonKreverSkrivetilgang type="submit" variant="primary" size="small" loading={isPending}>
                        Lagre
                    </ButtonKreverSkrivetilgang>
                    <Button type="button" variant="tertiary" size="small" disabled={isPending} onClick={onLukk}>
                        Avbryt
                    </Button>
                </HStack>
                {error && <ErrorMessage size="small">{somFeilmelding(error)}</ErrorMessage>}
            </VStack>
        </FormProvider>
    );
}

interface JaNeiSpørsmålProps {
    name: 'eøsBorger' | 'oppholdIGodkjentOmråde' | 'godkjentOppholdInntilFireUker';
    legend: string;
}

function JaNeiSpørsmål({ name, legend }: JaNeiSpørsmålProps): ReactElement {
    return (
        <Controller<OppholdskravSchema, JaNeiSpørsmålProps['name']>
            name={name}
            render={({ field, fieldState }) => (
                <RadioGroup
                    {...field}
                    value={field.value ?? null}
                    legend={legend}
                    size="small"
                    error={fieldState.error?.message}
                >
                    <Radio value={JaNei.JA}>Ja</Radio>
                    <Radio value={JaNei.NEI}>Nei</Radio>
                </RadioGroup>
            )}
        />
    );
}

function somFeilmelding(error: PostOppholdskravvurderingBehandlerMutationError): string {
    if (error.status === 403) return 'Du har ikke tilgang til å vurdere oppholdskravet for denne personen.';
    return error.info?.title ?? 'Kunne ikke lagre vurderingen';
}

function finnSperre(markerteDager: Utbetalingstabelldag[]): string | undefined {
    const avslåtteDager = dagerAvslåttForSenMeldingTilNav(markerteDager);
    if (avslåtteDager.length === 0) return undefined;
    return `En dag kan bare ha én avslagsårsak. ${somDagliste(avslåtteDager.map((dag) => dag.dato))} er avslått fordi melding til Nav kom for sent. Endre ${dagenEllerDagene(avslåtteDager.length)} før du vurderer oppholdskravet.`;
}
