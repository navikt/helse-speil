import React, { ReactElement } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Radio, RadioGroup, TextField, Textarea, VStack } from '@navikt/ds-react';

import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import {
    ManuellVurderingAvVilkårSchema,
    ManueltVurderbarVilkårskode,
    manuellVurderingAvVilkårSkjema,
    vilkårsspørsmål,
} from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiUtfall } from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    usePostManuellVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { useQueryClient } from '@tanstack/react-query';

interface ManuellVurderingAvVilkårSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: ManueltVurderbarVilkårskode;
    eksisterendeUtfall?: ApiUtfall;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onLukk: () => void;
}

export const ManuellVurderingAvVilkårSkjema = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    eksisterendeUtfall,
    onOverstyrt,
    onLukk,
}: ManuellVurderingAvVilkårSkjemaProps): ReactElement => {
    const queryClient = useQueryClient();

    const form = useForm<ManuellVurderingAvVilkårSchema>({
        resolver: zodResolver(manuellVurderingAvVilkårSkjema),
        defaultValues: { utfall: eksisterendeUtfall, fritekstbegrunnelse: '', journalpostIder: [{ verdi: '' }] },
    });
    const { fields, append, remove } = useFieldArray<ManuellVurderingAvVilkårSchema, 'journalpostIder'>({
        control: form.control,
        name: 'journalpostIder',
    });

    const { mutate, isPending, isError } = usePostManuellVilkårsvurderingBehandler({
        mutation: {
            onSuccess: (response) => {
                queryClient.invalidateQueries({
                    queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
                });
                onOverstyrt(response.opptjeningsvurderingId);
                onLukk();
            },
        },
    });

    function onSubmit({ utfall, fritekstbegrunnelse, journalpostIder }: ManuellVurderingAvVilkårSchema) {
        mutate({
            personId: personPseudoId,
            data: {
                skjæringstidspunkt,
                vilkårskode,
                utfall,
                fritekstbegrunnelse,
                journalpostId: journalpostIder
                    .map((journalpostId) => journalpostId.verdi)
                    .filter((verdi) => verdi !== ''),
            },
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
                        label={<VisesIkkeIVedtakTag label="Begrunnelse" />}
                        description={
                            <span className="mt-2 block">
                                Begrunnelsen blir ikke vist til den sykmeldte, med mindre hen ber om innsyn.
                            </span>
                        }
                        size="small"
                        minRows={3}
                        className="max-w-150"
                        error={fieldState.error?.message}
                    />
                )}
            />
            <VStack gap="space-4">
                {fields.map((field, index) => (
                    <HStack key={field.id} gap="space-8" align="end">
                        <Controller
                            control={form.control}
                            name={`journalpostIder.${index}.verdi` as const}
                            rules={{
                                pattern: {
                                    value: /^\d*$/,
                                    message: 'Journalpost-ID kan bare inneholde tall',
                                },
                            }}
                            render={({ field: journalpostField, fieldState }) => {
                                const journalpostIdFeil =
                                    fieldState.error?.message ??
                                    (/^(?:\d{1,11})?$/.test(journalpostField.value)
                                        ? undefined
                                        : 'Journalpost-ID må være 1 til 11 siffer');

                                return (
                                    <TextField
                                        {...journalpostField}
                                        label={index === 0 ? 'Journalpost-ID' : undefined}
                                        description="Denne finner du i Gosys"
                                        size="small"
                                        inputMode="numeric"
                                        pattern="[0-9]{0,11}"
                                        error={journalpostIdFeil}
                                    />
                                );
                            }}
                        />
                        {index > 0 && (
                            <Button variant="tertiary" size="small" onClick={() => remove(index)}>
                                Fjern
                            </Button>
                        )}
                    </HStack>
                ))}
                <div className="w-fit">
                    <Button
                        type="button"
                        variant="tertiary"
                        size="xsmall"
                        icon={<PlusIcon />}
                        onClick={() => append({ verdi: '' })}
                        style={{ justifySelf: 'start', paddingInlineStart: 'var(--ax-space-0)' }}
                    >
                        Legg til flere Journalpost-ID
                    </Button>
                </div>
            </VStack>
            <HStack gap="space-8">
                <Button type="submit" variant="primary" size="small" loading={isPending}>
                    Lagre
                </Button>
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
    );
};
