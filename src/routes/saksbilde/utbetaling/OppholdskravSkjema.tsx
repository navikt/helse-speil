import { useParams } from 'next/navigation';
import { ReactElement, useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, ErrorMessage, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import {
    GrunnForIkkeOppfylt,
    GrunnForOppfylt,
    OppholdskravSchema,
    oppholdskravDefaultValues,
    oppholdskravSkjema,
    tilOppholdskravRequest,
} from '@form-schemas/oppholdskravSkjema';
import { JaNei } from '@form-schemas/opptjeningsvurderingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
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
    const dager = somSorterteDatoer(markerteDager);
    const sperre = finnSperre(Array.from(markerteDager.values()));

    const form = useForm<OppholdskravSchema>({
        resolver: zodResolver(oppholdskravSkjema),
        defaultValues: oppholdskravDefaultValues(dager),
    });
    const svar = useWatch({ control: form.control });

    useEffect(() => {
        form.setValue('dager', somSorterteDatoer(markerteDager), { shouldValidate: form.formState.isSubmitted });
    }, [markerteDager, form]);

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
                paddingBlock="space-16"
                gap="space-20"
                className="border-t border-ax-border-neutral-subtle [&_label]:text-ax-medium [&_legend]:text-ax-medium"
                onSubmit={form.handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <JaNeiSpørsmål name="eøsBorger" legend="Er personen EU-/EØS-borger?" />
                <JaNeiSpørsmål name="oppfyllerOppholdskravet" legend="Oppfyller medlemmet oppholdskravet?" />
                {svar.oppfyllerOppholdskravet === JaNei.JA && (
                    <GrunnSpørsmål
                        name="grunnForOppfylt"
                        legend="Begrunnelse for godkjent opphold"
                        grunner={grunnerForOppfylt(svar.eøsBorger)}
                    />
                )}
                {svar.oppfyllerOppholdskravet === JaNei.NEI && (
                    <GrunnSpørsmål
                        name="grunnForIkkeOppfylt"
                        legend="Begrunnelse for ikke godkjent opphold"
                        grunner={grunnerForIkkeOppfylt}
                    />
                )}
                {form.formState.errors.dager?.message && (
                    <ErrorMessage size="small">{form.formState.errors.dager.message}</ErrorMessage>
                )}
                {sperre && <ErrorMessage size="small">{sperre}</ErrorMessage>}

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
    name: 'eøsBorger' | 'oppfyllerOppholdskravet';
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

function somSorterteDatoer(markerteDager: Map<string, Utbetalingstabelldag>): string[] {
    return Array.from(markerteDager.keys()).sort();
}

interface GrunnSpørsmålProps {
    name: 'grunnForOppfylt' | 'grunnForIkkeOppfylt';
    legend: string;
    grunner: Grunn[];
}

interface Grunn {
    verdi: GrunnForOppfylt | GrunnForIkkeOppfylt;
    label: string;
}

function GrunnSpørsmål({ name, legend, grunner }: GrunnSpørsmålProps): ReactElement {
    return (
        <Controller<OppholdskravSchema, GrunnSpørsmålProps['name']>
            name={name}
            render={({ field, fieldState }) => (
                <RadioGroup
                    {...field}
                    value={field.value ?? null}
                    legend={legend}
                    size="small"
                    error={fieldState.error?.message}
                >
                    {grunner.map((grunn) => (
                        <Radio key={grunn.verdi} value={grunn.verdi}>
                            {grunn.label}
                        </Radio>
                    ))}
                </RadioGroup>
            )}
        />
    );
}

// Rekkefølgen følger skissen. Første ledd gjelder bare opphold i Norge for den som ikke er EU-/EØS-borger.
function grunnerForOppfylt(eøsBorger: OppholdskravSchema['eøsBorger']): Grunn[] {
    return [
        {
            verdi: GrunnForOppfylt.INNVILGET_SØKNAD,
            label: 'Innvilget søknad om utenlandsopphold utenfor EU/EØS',
        },
        { verdi: GrunnForOppfylt.MEDLEM, label: 'Medlem etter §§ 2-5, 2-6 eller 2-8' },
        { verdi: GrunnForOppfylt.HELSEINSTITUSJON, label: 'Godkjent opphold på helseinstitusjon i utlandet' },
        { verdi: GrunnForOppfylt.YRKESSKADE, label: 'Sykefraværet skyldes en godkjent yrkesskade' },
        {
            verdi: GrunnForOppfylt.OPPHOLD_I_GODKJENT_OMRÅDE,
            label:
                eøsBorger === JaNei.NEI
                    ? 'Har oppholdt seg i Norge'
                    : 'Har oppholdt seg i Norge, EU/EØS eller et land med trygdeavtale',
        },
    ];
}

const grunnerForIkkeOppfylt: Grunn[] = [
    { verdi: GrunnForIkkeOppfylt.SØKNAD_AVSLÅTT, label: 'Nav-kontoret har avslått søknaden' },
    {
        verdi: GrunnForIkkeOppfylt.IKKE_SØKT,
        label: 'Sykmeldt har ikke sendt søknad om å beholde sykepenger utenfor EU/EØS',
    },
];
