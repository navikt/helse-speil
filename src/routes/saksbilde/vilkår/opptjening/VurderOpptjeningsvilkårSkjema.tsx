import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EyeSlashIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Radio, RadioGroup, Tag, Textarea, VStack } from '@navikt/ds-react';

import {
    ManueltVurderbarVilkårskode,
    OverstyrVilkårsvurderingSchema,
    overstyrVilkårsvurderingSkjema,
    vilkårsspørsmål,
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
    eksisterendeUtfall?: ApiUtfall;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onAvbryt: () => void;
}

export const VurderOpptjeningsvilkårSkjema = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    eksisterendeUtfall,
    onOverstyrt,
    onAvbryt,
}: VurderOpptjeningsvilkårSkjemaProps): ReactElement => {
    const queryClient = useQueryClient();

    const form = useForm<OverstyrVilkårsvurderingSchema>({
        resolver: zodResolver(overstyrVilkårsvurderingSkjema),
        defaultValues: { utfall: eksisterendeUtfall, fritekstbegrunnelse: '' },
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
        <VStack as="form" gap="space-16" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Controller
                control={form.control}
                name="fritekstbegrunnelse"
                render={({ field, fieldState }) => (
                    <Textarea
                        {...field}
                        label={
                            <VStack gap="space-4">
                                <span>Begrunnelse for vurderingen</span>
                                <Tag size="xsmall" variant="alt1" icon={<EyeSlashIcon aria-hidden />}>
                                    Vises ikke i vedtaket
                                </Tag>
                            </VStack>
                        }
                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                        size="small"
                        minRows={3}
                        className="max-w-150"
                        error={fieldState.error?.message}
                    />
                )}
            />
            <HStack gap="space-8">
                <Button type="submit" variant="primary" size="small" loading={isPending}>
                    Lagre
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
    );
};
