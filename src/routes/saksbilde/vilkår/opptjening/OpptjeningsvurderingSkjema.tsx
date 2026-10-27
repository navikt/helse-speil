import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Checkbox, CheckboxGroup, InlineMessage, LocalAlert, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    JaNei,
    OpptjeningsvurderingSchema,
    aktuelleSpørsmål,
    girIkkeOppfylt,
    girOppfylt,
    opptjeningsaktivitetValg,
    opptjeningsaktiviteter,
    opptjeningsvurderingDefaultValues,
    opptjeningsvurderingSkjema,
    tilOpptjeningsvurderingRequest,
} from '@form-schemas/opptjeningsvurderingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiOpptjeningsaktivitet } from '@io/rest/generated/vilkarsproving.schemas';
import { usePostManuellOpptjeningsvurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { kanVurdereLikestilteYtelser } from '@utils/featureToggles';

import { BegrunnelseOgJournalpost } from './BegrunnelseOgJournalpost';
import { Skjemaknapper } from './Skjemaknapper';
import { skjemasporing } from './skjemasporing';
import { useInvaliderOpptjening } from './useInvaliderOpptjening';

interface OpptjeningsvurderingSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onLukk: () => void;
}

export function OpptjeningsvurderingSkjema({
    personPseudoId,
    skjæringstidspunkt,
    onOverstyrt,
    onLukk,
}: OpptjeningsvurderingSkjemaProps): ReactElement {
    const invaliderOpptjening = useInvaliderOpptjening(personPseudoId);
    const sporing = skjemasporing('opptjening');
    const valgbareAktiviteter = kanVurdereLikestilteYtelser()
        ? opptjeningsaktiviteter
        : [ApiOpptjeningsaktivitet.ARBEID];

    const form = useForm<OpptjeningsvurderingSchema>({
        resolver: zodResolver(opptjeningsvurderingSkjema),
        defaultValues: opptjeningsvurderingDefaultValues,
    });
    const svar = useWatch({ control: form.control });
    const aktuelle = aktuelleSpørsmål(svar);
    // Ikke oppfylt kan ikke lagres ennå, se IkkeOppfyltStøttesIkke i sp-vilkarsproving
    const ikkeOppfyltStøttesIkke = girIkkeOppfylt(svar);
    // Vises først når ikke oppfylt kan lagres og ikkeOppfyltStøttesIkke ikke lenger blokkerer
    const erIkkeOppfylt = girIkkeOppfylt(svar);
    const erOppfylt = girOppfylt(svar);

    const { mutate, isPending, isError } = usePostManuellOpptjeningsvurderingBehandler({
        mutation: {
            onSuccess: (response, { data }) => {
                sporing.fullført({
                    minst4Uker: data?.minst4Uker,
                    opptjeningsaktiviteter: [...(data?.opptjeningsaktiviteter ?? [])].sort().join(','),
                    harJournalpost: (data?.journalpostId.length ?? 0) > 0,
                });
                invaliderOpptjening();
                onOverstyrt(response.opptjeningsvurderingId);
                onLukk();
            },
            onError: sporing.feilet,
        },
    });

    function avbryt() {
        sporing.avbrutt();
        onLukk();
    }

    function onSubmit(skjema: OpptjeningsvurderingSchema) {
        mutate({ personId: personPseudoId, data: tilOpptjeningsvurderingRequest(skjema, skjæringstidspunkt) });
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit, sporing.valideringsfeil)}>
                <JaNeiSpørsmål
                    name="minst4Uker"
                    legend="Har søkeren hatt arbeid, likestilt ytelse, eller en kombinasjon av arbeid og likestilt ytelse, i minst 4 uker umiddelbart før arbeidsuførheten?"
                />
                {aktuelle.opptjeningsaktiviteter && (
                    <Controller
                        control={form.control}
                        name="opptjeningsaktiviteter"
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                legend="Hvilken likestilt ytelse/arbeid har søkeren hatt i de siste 4 ukene umiddelbart før arbeidsuførheten?"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            >
                                {valgbareAktiviteter.map((aktivitet) => (
                                    <Checkbox key={aktivitet} value={aktivitet}>
                                        {opptjeningsaktivitetValg(aktivitet)}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        )}
                    />
                )}
                {aktuelle.foreldrepengerOpptjentPåAap && (
                    <JaNeiSpørsmål
                        name="foreldrepengerOpptjentPåAap"
                        legend="Er foreldrepengene opptjent på grunnlag av arbeidsavklaringspenger?"
                    />
                )}
                {aktuelle.yrkesaktivMinst4UkerFørUttak && (
                    <JaNeiSpørsmål
                        name="yrkesaktivMinst4UkerFørUttak"
                        legend="Var søkeren sammenhengende yrkesaktiv, eller mottok sykepenger, pleie-, omsorgs- eller opplæringspenger, foreldrepenger eller svangerskapspenger, i minst 4 uker umiddelbart før uttaket av foreldrepenger startet?"
                    />
                )}
                {ikkeOppfyltStøttesIkke ? (
                    <IkkeOppfyltStøttesIkkeAlert />
                ) : (
                    <>
                        {erOppfylt && <InlineMessage status="success">Vilkåret er oppfylt</InlineMessage>}
                        {erIkkeOppfylt && <InlineMessage status="warning">Vilkåret er ikke oppfylt</InlineMessage>}
                        <BegrunnelseOgJournalpost />
                    </>
                )}
                <Skjemaknapper
                    visLagre={!ikkeOppfyltStøttesIkke}
                    lagrer={isPending}
                    lagringFeilet={isError}
                    onAvbryt={avbryt}
                />
            </VStack>
        </FormProvider>
    );
}

function IkkeOppfyltStøttesIkkeAlert(): ReactElement {
    return (
        <LocalAlert status="warning" size="small">
            <LocalAlert.Header>
                <LocalAlert.Title>
                    Det er ennå ikke støtte for å manuelt vurdere vilkåret til ikke oppfylt
                </LocalAlert.Title>
            </LocalAlert.Header>
        </LocalAlert>
    );
}

interface JaNeiSpørsmålProps {
    name: 'minst4Uker' | 'foreldrepengerOpptjentPåAap' | 'yrkesaktivMinst4UkerFørUttak';
    legend: string;
}

function JaNeiSpørsmål({ name, legend }: JaNeiSpørsmålProps): ReactElement {
    return (
        <Controller<OpptjeningsvurderingSchema, JaNeiSpørsmålProps['name']>
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
