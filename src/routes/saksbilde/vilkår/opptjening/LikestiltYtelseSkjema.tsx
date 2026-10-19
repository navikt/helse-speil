import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Alert, Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    JaNei,
    LikestiltYtelseSchema,
    aktuelleSpørsmål,
    girIkkeOppfylt,
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
import { IkkeOppfyltStøttesIkkeAlert } from './ManuellVurderingAvVilkårSkjema';
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

    const { mutate, isPending, isError } = usePostManuellLikestiltYtelseVurderingBehandler({
        mutation: {
            onSuccess: (response) => {
                invaliderOpptjening();
                onOverstyrt(response.opptjeningsvurderingId);
                onLukk();
            },
        },
    });

    function onSubmit(skjema: LikestiltYtelseSchema) {
        mutate({ personId: personPseudoId, data: tilLikestiltYtelseRequest(skjema, skjæringstidspunkt) });
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit)}>
                <JaNeiSpørsmål
                    name="sammenlagtMinst4Uker"
                    legend="Har søkeren hatt arbeid og/eller likestilt ytelse i minst 4 uker umiddelbart før arbeidsuførheten?"
                    description="Arbeid og ytelser legges sammen. Det må ikke være opphold."
                />
                {aktuelle.ytelser && (
                    <Controller
                        control={form.control}
                        name="ytelser"
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                legend="Hvilke likestilte ytelser har søkeren mottatt?"
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
                        description="Andre punktum. Se opptjeningen i fpsak."
                    />
                )}
                {aktuelle.yrkesaktivMinst4UkerFørUttak && (
                    <JaNeiSpørsmål
                        name="yrkesaktivMinst4UkerFørUttak"
                        legend="Var søkeren sammenhengende yrkesaktiv, eller mottok ytelse etter kapittel 8, 9 eller 14, i minst 4 uker umiddelbart før uttaket av foreldrepenger startet?"
                        description="Tredje punktum. Dagpenger teller ikke. Svangerskapspenger må være opptjent ved yrkesaktivitet."
                    />
                )}
                {erIkkeOppfylt ? <IkkeOppfyltStøttesIkkeAlert /> : <BegrunnelseOgJournalpost />}
                <HStack gap="space-8">
                    {!erIkkeOppfylt && (
                        <Button type="submit" variant="primary" size="small" loading={isPending}>
                            Lagre
                        </Button>
                    )}
                    <Button type="button" variant="tertiary" size="small" onClick={onLukk}>
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
    description: string;
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
