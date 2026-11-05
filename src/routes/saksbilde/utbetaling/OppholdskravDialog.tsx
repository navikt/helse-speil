import { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import {
    BodyShort,
    Button,
    Dialog,
    ErrorMessage,
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
import { somDagliste } from '@saksbilde/utbetaling/utbetalingstabell/oppholdskravSperrer';
import { BegrunnelseOgJournalpost } from '@saksbilde/vilkår/opptjening/BegrunnelseOgJournalpost';
import { useQueryClient } from '@tanstack/react-query';

interface OppholdskravDialogProps {
    personPseudoId: string;
    behandlingId: string;
    dager: string[];
    onLukk: () => void;
}

// Foreløpig dialog for å teste flyten i dev. Byttes når skissene for § 8-9 er klare (navikt/sas-issues#98).
export function OppholdskravDialog({
    personPseudoId,
    behandlingId,
    dager,
    onLukk,
}: OppholdskravDialogProps): ReactElement {
    const queryClient = useQueryClient();
    const sorterteDager = [...dager].sort();

    const form = useForm<OppholdskravSchema>({
        resolver: zodResolver(oppholdskravSkjema),
        defaultValues: oppholdskravDefaultValues(sorterteDager),
    });
    const svar = useWatch({ control: form.control });
    const aktuelle = aktuelleSpørsmål(svar);

    const { mutate, isPending, error } = usePostOppholdskravvurderingBehandler({
        mutation: {
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: getGetSaksbehandlerhandlingerForPersonQueryKey(personPseudoId),
                });
                onLukk();
            },
        },
    });

    function onSubmit(skjema: OppholdskravSchema) {
        mutate({ personId: personPseudoId, data: tilOppholdskravRequest(skjema, behandlingId) });
    }

    return (
        <Dialog
            open
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onLukk();
            }}
        >
            <Dialog.Popup width="medium">
                <Dialog.Header>
                    <Dialog.Title>Vurder oppholdskrav</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <FormProvider {...form}>
                        <VStack
                            as="form"
                            id="oppholdskrav-form"
                            gap="space-20"
                            onSubmit={form.handleSubmit(onSubmit)}
                            autoComplete="off"
                        >
                            <VStack gap="space-4">
                                <Label size="small" as="p">
                                    Dager
                                </Label>
                                <BodyShort size="small">{somDagliste(dager)}</BodyShort>
                                {form.formState.errors.dager?.message && (
                                    <ErrorMessage size="small">{form.formState.errors.dager.message}</ErrorMessage>
                                )}
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
                            {girIkkeOppfylt(svar) && (
                                <InlineMessage status="warning">Vilkåret er ikke oppfylt</InlineMessage>
                            )}
                            <BegrunnelseOgJournalpost />
                        </VStack>
                    </FormProvider>
                </Dialog.Body>
                <Dialog.Footer>
                    {error && (
                        <ErrorMessage size="small" className="mr-auto self-center">
                            {somFeilmelding(error)}
                        </ErrorMessage>
                    )}
                    <Dialog.CloseTrigger>
                        <Button variant="tertiary" type="button" size="small" disabled={isPending}>
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                    <ButtonKreverSkrivetilgang
                        variant="primary"
                        type="submit"
                        size="small"
                        form="oppholdskrav-form"
                        loading={isPending}
                    >
                        Lagre
                    </ButtonKreverSkrivetilgang>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
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
