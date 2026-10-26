import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { LocalAlert, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    EnkeltvurderbarVilkårskode,
    ManuellVurderingAvVilkårSchema,
    manuellVurderingAvVilkårSkjema,
    vilkårsspørsmål,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { begrunnelseOgJournalpostDefaultValues, journalpostIderTilRequest } from '@form-schemas/opptjeningSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiUtfall } from '@io/rest/generated/vilkarsproving.schemas';
import { usePostManuellArbeidMinstFireUkerVurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

import { BegrunnelseOgJournalpost } from './BegrunnelseOgJournalpost';
import { Skjemaknapper } from './Skjemaknapper';
import { skjemasporing } from './skjemasporing';
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
    const sporing = skjemasporing('opptjening arbeid');

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
                sporing.fullført({ utfall: data?.utfall, harJournalpost: data?.journalpostId != null });
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
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit, sporing.valideringsfeil)}>
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
                <Skjemaknapper visLagre={!erIkkeOppfylt} lagrer={isPending} lagringFeilet={isError} onAvbryt={avbryt} />
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
