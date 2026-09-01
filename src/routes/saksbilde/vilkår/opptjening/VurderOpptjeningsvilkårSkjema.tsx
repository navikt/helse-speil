import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Alert, Box, Button, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import {
    ManueltVurderbarVilkårskode,
    OverstyrVilkårsvurderingSchema,
    overstyrVilkårsvurderingSkjema,
} from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiUtfall } from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    useOverstyrVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { useQueryClient } from '@tanstack/react-query';

interface VurderOpptjeningsvilkårSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: ManueltVurderbarVilkårskode;
    vilkårsnavn: string;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onAvbryt: () => void;
}

export const VurderOpptjeningsvilkårSkjema = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    vilkårsnavn,
    onOverstyrt,
    onAvbryt,
}: VurderOpptjeningsvilkårSkjemaProps): ReactElement => {
    const queryClient = useQueryClient();

    const form = useForm<OverstyrVilkårsvurderingSchema>({
        resolver: zodResolver(overstyrVilkårsvurderingSkjema),
        defaultValues: { fritekstbegrunnelse: '' },
    });

    const { mutate, isPending, isError } = useOverstyrVilkårsvurderingBehandler({
        mutation: {
            onSuccess: (response) => {
                queryClient.invalidateQueries({
                    queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
                });
                onOverstyrt(response.opptjeningsvurderingId);
            },
        },
    });

    function onSubmit({ utfall, fritekstbegrunnelse }: OverstyrVilkårsvurderingSchema) {
        mutate({
            personId: personPseudoId,
            data: { skjæringstidspunkt, vilkårskode, utfall, fritekstbegrunnelse },
        });
    }

    return (
        <Box background="neutral-soft" borderRadius="8" padding="space-16">
            <VStack as="form" gap="space-16" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    control={form.control}
                    name="utfall"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            {...field}
                            value={field.value ?? null}
                            legend={`Utfall for ${vilkårsnavn}`}
                            size="small"
                            error={fieldState.error?.message}
                        >
                            <Radio value={ApiUtfall.OPPFYLT}>Oppfylt</Radio>
                            <Radio value={ApiUtfall.IKKE_OPPFYLT}>Ikke oppfylt</Radio>
                        </RadioGroup>
                    )}
                />
                <Controller
                    control={form.control}
                    name="fritekstbegrunnelse"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            label={`Begrunnelse for ${vilkårsnavn}`}
                            size="small"
                            minRows={3}
                            className="max-w-150"
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <HStack gap="space-8">
                    <Button type="submit" variant="primary" size="small" loading={isPending}>
                        Lagre vurdering
                    </Button>
                    <Button type="button" variant="tertiary" size="small" onClick={onAvbryt}>
                        Avbryt
                    </Button>
                </HStack>
                {isError && (
                    <Alert variant="error" size="small" inline>
                        Kunne ikke lagre vurderingen
                    </Alert>
                )}
            </VStack>
        </Box>
    );
};
