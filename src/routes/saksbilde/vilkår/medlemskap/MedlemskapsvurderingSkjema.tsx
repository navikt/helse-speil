import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Radio, RadioGroup, VStack } from '@navikt/ds-react';

import {
    MedlemskapsvurderingSchema,
    medlemskapsvurderingDefaultValues,
    medlemskapsvurderingSkjema,
    tilMedlemskapsvurderingRequest,
} from '@form-schemas/medlemskapsvurderingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiManuellMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import {
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    usePostManuellVilkårsvurderingBehandler,
} from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { useQueryClient } from '@tanstack/react-query';

import { BegrunnelseOgJournalpost } from '../opptjening/BegrunnelseOgJournalpost';
import { Skjemaknapper } from '../opptjening/Skjemaknapper';
import { skjemasporing } from '../opptjening/skjemasporing';

interface MedlemskapsvurderingSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    onOverstyrt: (medlemskapsvurderingId: string) => void;
    onLukk: () => void;
}

export function MedlemskapsvurderingSkjema({
    personPseudoId,
    skjæringstidspunkt,
    onOverstyrt,
    onLukk,
}: MedlemskapsvurderingSkjemaProps): ReactElement {
    const queryClient = useQueryClient();
    const sporing = skjemasporing('medlemskap');

    const form = useForm<MedlemskapsvurderingSchema>({
        resolver: zodResolver(medlemskapsvurderingSkjema),
        defaultValues: medlemskapsvurderingDefaultValues,
    });

    const { mutate, isPending, isError } = usePostManuellVilkårsvurderingBehandler({
        mutation: {
            onSuccess: (response, { data }) => {
                sporing.fullført({
                    status: data?.status,
                    harJournalpost: (data?.journalpostId.length ?? 0) > 0,
                });
                void queryClient.invalidateQueries({
                    queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
                });
                onOverstyrt(response.medlemskapsvurderingId);
                onLukk();
            },
            onError: sporing.feilet,
        },
    });

    function avbryt() {
        sporing.avbrutt();
        onLukk();
    }

    function onSubmit(skjema: MedlemskapsvurderingSchema) {
        mutate({ personId: personPseudoId, data: tilMedlemskapsvurderingRequest(skjema, skjæringstidspunkt) });
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" gap="space-20" onSubmit={form.handleSubmit(onSubmit, sporing.valideringsfeil)}>
                <Controller
                    control={form.control}
                    name="status"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            {...field}
                            value={field.value ?? null}
                            legend="Er søkeren medlem i folketrygden?"
                            size="small"
                            error={fieldState.error?.message}
                        >
                            <Radio value={ApiManuellMedlemskapsstatus.JA}>Ja</Radio>
                            <Radio value={ApiManuellMedlemskapsstatus.NEI}>Nei</Radio>
                        </RadioGroup>
                    )}
                />
                <BegrunnelseOgJournalpost />
                <Skjemaknapper lagrer={isPending} lagringFeilet={isError} onAvbryt={avbryt} />
            </VStack>
        </FormProvider>
    );
}
