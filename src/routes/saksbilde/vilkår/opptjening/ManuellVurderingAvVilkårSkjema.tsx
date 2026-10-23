import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Events } from '@navikt/analytics-types';
import { Alert, Button, HStack, LocalAlert, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    EnkeltvurderbarVilkårskode,
    ManuellVurderingAvVilkårSchema,
    begrunnelseOgJournalpostDefaultValues,
    journalpostIderTilRequest,
    manuellVurderingAvVilkårSkjema,
    vilkårsspørsmål,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiUtfall } from '@io/rest/generated/vilkarsproving.schemas';
import { usePostManuellArbeidMinstFireUkerVurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { sporHendelse, sporValideringsfeil } from '@observability/hendelser';

import { BegrunnelseOgJournalpost } from './BegrunnelseOgJournalpost';
import { useInvaliderOpptjening } from './useInvaliderOpptjening';

interface ManuellVurderingAvVilkårSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: EnkeltvurderbarVilkårskode;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onLukk: () => void;
}

export function ManuellVurderingAvVilkårSkjema({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    onOverstyrt,
    onLukk,
}: ManuellVurderingAvVilkårSkjemaProps): ReactElement {
    const invaliderOpptjening = useInvaliderOpptjening(personPseudoId);

    const form = useForm<ManuellVurderingAvVilkårSchema>({
        resolver: zodResolver(manuellVurderingAvVilkårSkjema),
        defaultValues: {
            utfall: undefined,
            ...begrunnelseOgJournalpostDefaultValues,
        },
    });
    const erIkkeOppfylt = useWatch({ control: form.control, name: 'utfall' }) === ApiUtfall.IKKE_OPPFYLT;

    const { mutate, isPending, isError } = usePostManuellArbeidMinstFireUkerVurderingBehandler({
        mutation: {
            onSuccess: (response, { data }) => {
                sporHendelse({
                    name: Events.SKJEMA_FULLFORT,
                    properties: {
                        skjemanavn: 'opptjening arbeid',
                        utfall: data?.utfall,
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
                    properties: { skjemanavn: 'opptjening arbeid' },
                });
            },
        },
    });

    function avbryt() {
        sporHendelse({ name: 'skjema avbrutt', properties: { skjemanavn: 'opptjening arbeid' } });
        onLukk();
    }

    function onSubmit({
        utfall,
        fritekstbegrunnelse,
        journalpostvalg,
        journalpostIder,
    }: ManuellVurderingAvVilkårSchema) {
        mutate({
            personId: personPseudoId,
            data: {
                skjæringstidspunkt,
                utfall,
                fritekstbegrunnelse,
                journalpostId: journalpostIderTilRequest({ journalpostvalg, journalpostIder }),
            },
        });
    }

    return (
        <FormProvider {...form}>
            <VStack
                as="form"
                gap="space-20"
                onSubmit={form.handleSubmit(onSubmit, (errors) => sporValideringsfeil('opptjening arbeid', errors))}
            >
                <Controller
                    control={form.control}
                    name="utfall"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            {...field}
                            value={field.value ?? null}
                            legend={vilkårsspørsmål[vilkårskode]}
                            description="Søkeren må ha vært i arbeid minst 4 uker umiddelbart før arbeidsuførheten"
                            size="small"
                            error={fieldState.error?.message}
                        >
                            <Radio value={ApiUtfall.OPPFYLT}>Oppfylt</Radio>
                            <Radio value={ApiUtfall.IKKE_OPPFYLT}>Ikke oppfylt</Radio>
                        </RadioGroup>
                    )}
                />
                {erIkkeOppfylt ? <IkkeOppfyltStøttesIkkeAlert /> : <BegrunnelseOgJournalpost />}
                <HStack gap="space-8">
                    {!erIkkeOppfylt && (
                        <Button type="submit" variant="primary" size="small" loading={isPending}>
                            Lagre
                        </Button>
                    )}
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

export function IkkeOppfyltStøttesIkkeAlert(): ReactElement {
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
