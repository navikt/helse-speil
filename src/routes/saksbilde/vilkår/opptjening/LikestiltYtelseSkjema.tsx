import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Events } from '@navikt/analytics-types';
import {
    Alert,
    Button,
    Checkbox,
    CheckboxGroup,
    HStack,
    InlineMessage,
    Radio,
    RadioGroup,
    VStack,
} from '@navikt/ds-react';

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
import { sporHendelse, sporValideringsfeil } from '@observability/hendelser';

import { BegrunnelseOgJournalpost } from './BegrunnelseOgJournalpost';
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
                sporHendelse({
                    name: Events.SKJEMA_FULLFORT,
                    properties: {
                        skjemanavn: 'opptjening likestilt ytelse',
                        sammenlagtMinst4Uker: data?.sammenlagtMinst4Uker,
                        ytelser: [...(data?.ytelser ?? [])].sort().join(','),
                        harJournalpost: data?.journalpostId != null,
                    },
                });
                invaliderOpptjening();
                onOverstyrt(response.opptjeningsvurderingId);
                onLukk();
            },
            onError: () => {
                sporHendelse({
                    name: Events.SKJEMA_INNSENDING_FEILET,
                    properties: { skjemanavn: 'opptjening likestilt ytelse' },
                });
            },
        },
    });

    function avbryt() {
        sporHendelse({ name: 'skjema avbrutt', properties: { skjemanavn: 'opptjening likestilt ytelse' } });
        onLukk();
    }

    function onSubmit(skjema: LikestiltYtelseSchema) {
        mutate({ personId: personPseudoId, data: tilLikestiltYtelseRequest(skjema, skjæringstidspunkt) });
    }

    return (
        <FormProvider {...form}>
            <VStack
                as="form"
                gap="space-20"
                onSubmit={form.handleSubmit(onSubmit, (errors) =>
                    sporValideringsfeil('opptjening likestilt ytelse', errors),
                )}
            >
                <JaNeiSpørsmål
                    name="sammenlagtMinst4Uker"
                    legend="Har søkeren hatt  likestilt ytelse, eller en kombinasjon av arbeid og likestilt ytelse, i minst 4 uker umiddelbart før arbeidsuførheten?"
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
                        legend="Var søkeren sammenhengende yrkesaktiv, eller mottok sykepenger,  pleie-, omsorgs- eller opplæringspenger,  foreldrepenger eller svangerskapspenger, i minst 4 uker umiddelbart før uttaket av foreldrepenger startet?"
                    />
                )}
                {erOppfylt && <InlineMessage status="success">Vilkåret er oppfylt</InlineMessage>}
                {erIkkeOppfylt && <InlineMessage status="warning">Vilkåret er ikke oppfylt</InlineMessage>}
                <BegrunnelseOgJournalpost />
                <HStack gap="space-8">
                    <Button type="submit" variant="primary" size="small" loading={isPending}>
                        Lagre
                    </Button>
                    <Button type="button" variant="tertiary" size="small" onClick={avbryt}>
                        Avbryt
                    </Button>
                </HStack>
                {isError && (
                    <Alert variant="error" size="small" inline>
                        Kunne ikke lagre vurderingen
                    </Alert>
                )}
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
