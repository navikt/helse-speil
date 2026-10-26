import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Checkbox, CheckboxGroup, InlineMessage, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    JaNei,
    LikestiltYtelseSchema,
    aktuelleSpørsmål,
    girIkkeOppfylt,
    girOppfylt,
    likestiltYtelseDefaultValues,
    likestiltYtelseKapittel,
    likestiltYtelseLabels,
    likestiltYtelseSkjema,
    tilLikestiltYtelseRequest,
} from '@form-schemas/likestiltYtelseSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiLikestiltYtelse } from '@io/rest/generated/vilkarsproving.schemas';
import { usePostManuellLikestiltYtelseVurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

import { BegrunnelseOgJournalpost } from './BegrunnelseOgJournalpost';
import { Skjemaknapper } from './Skjemaknapper';
import { skjemasporing } from './skjemasporing';
import { useInvaliderOpptjening } from './useInvaliderOpptjening';

interface LikestiltYtelseSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onLukk: () => void;
}

export function LikestiltYtelseSkjema({
    personPseudoId,
    skjæringstidspunkt,
    onOverstyrt,
    onLukk,
}: LikestiltYtelseSkjemaProps): ReactElement {
    const invaliderOpptjening = useInvaliderOpptjening(personPseudoId);
    const sporing = skjemasporing('opptjening likestilt ytelse');

    const form = useForm<LikestiltYtelseSchema>({
        resolver: zodResolver(likestiltYtelseSkjema),
        defaultValues: likestiltYtelseDefaultValues,
    });
    const svar = useWatch({ control: form.control });
    const aktuelle = aktuelleSpørsmål(svar);
    const erIkkeOppfylt = girIkkeOppfylt(svar);
    const erOppfylt = girOppfylt(svar);

    const { mutate, isPending, isError } = usePostManuellLikestiltYtelseVurderingBehandler({
        mutation: {
            onSuccess: (response, { data }) => {
                sporing.fullført({
                    sammenlagtMinst4Uker: data?.sammenlagtMinst4Uker,
                    ytelser: [...(data?.ytelser ?? [])].sort().join(','),
                    harJournalpost: data?.journalpostId != null,
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

    function onSubmit(skjema: LikestiltYtelseSchema) {
        mutate({ personId: personPseudoId, data: tilLikestiltYtelseRequest(skjema, skjæringstidspunkt) });
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit, sporing.valideringsfeil)}>
                <JaNeiSpørsmål
                    name="sammenlagtMinst4Uker"
                    legend="Har søkeren hatt likestilt ytelse, eller en kombinasjon av arbeid og likestilt ytelse, i minst 4 uker umiddelbart før arbeidsuførheten?"
                />
                {aktuelle.ytelser && (
                    <Controller
                        control={form.control}
                        name="ytelser"
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                legend="Hvilken likestilt ytelse har søkeren hatt i opptjeningstiden?"
                                description="Velg de aktuelle likestilte ytelsene"
                                size="small"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            >
                                {Object.values(ApiLikestiltYtelse).map((ytelse) => (
                                    <Checkbox key={ytelse} value={ytelse}>
                                        {`${likestiltYtelseLabels[ytelse]} (kap. ${likestiltYtelseKapittel[ytelse]})`}
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
                {erOppfylt && <InlineMessage status="success">Vilkåret er oppfylt</InlineMessage>}
                {erIkkeOppfylt && <InlineMessage status="warning">Vilkåret er ikke oppfylt</InlineMessage>}
                <BegrunnelseOgJournalpost />
                <Skjemaknapper lagrer={isPending} lagringFeilet={isError} onAvbryt={avbryt} />
            </VStack>
        </FormProvider>
    );
}

interface JaNeiSpørsmålProps {
    name: 'sammenlagtMinst4Uker' | 'foreldrepengerOpptjentPåAap' | 'yrkesaktivMinst4UkerFørUttak';
    legend: string;
    description?: string;
}

function JaNeiSpørsmål({ name, legend, description }: JaNeiSpørsmålProps): ReactElement {
    return (
        <Controller<LikestiltYtelseSchema, JaNeiSpørsmålProps['name']>
            name={name}
            render={({ field, fieldState }) => (
                <RadioGroup
                    {...field}
                    value={field.value ?? null}
                    legend={legend}
                    description={description}
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
