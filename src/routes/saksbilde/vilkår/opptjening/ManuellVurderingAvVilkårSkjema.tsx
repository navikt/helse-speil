import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

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
import { usePostManuellVilkårsvurderingBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

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

    const { mutate, isPending, isError } = usePostManuellVilkårsvurderingBehandler({
        mutation: {
            onSuccess: (response) => {
                invaliderOpptjening();
                onOverstyrt(response.opptjeningsvurderingId);
                onLukk();
            },
        },
    });

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
                vilkårskode,
                utfall,
                fritekstbegrunnelse,
                journalpostId: journalpostIderTilRequest({ journalpostvalg, journalpostIder }),
            },
        });
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    control={form.control}
                    name="utfall"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            {...field}
                            value={field.value ?? null}
                            legend={vilkårsspørsmål[vilkårskode]}
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
