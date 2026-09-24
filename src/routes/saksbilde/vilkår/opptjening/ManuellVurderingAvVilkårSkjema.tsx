import React, { ReactElement, useContext } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { EyeSlashIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Radio, RadioGroup, Tag, TextField, Textarea, VStack } from '@navikt/ds-react';

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

import { VurderingspanelContext } from '../VurderingspanelContext';

interface ManuellVurderingAvVilkårSkjemaProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: ManueltVurderbarVilkårskode;
    eksisterendeUtfall?: ApiUtfall;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onAvbryt: () => void;
}

export const ManuellVurderingAvVilkårSkjema = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    eksisterendeUtfall,
    onOverstyrt,
    onAvbryt,
}: ManuellVurderingAvVilkårSkjemaProps): ReactElement => {
    const queryClient = useQueryClient();
    const { lukkVurderingspanel } = useContext(VurderingspanelContext);

    const form = useForm<ManuellVurderingAvVilkårSchema>({
        resolver: zodResolver(manuellVurderingAvVilkårSkjema),
        defaultValues: { utfall: eksisterendeUtfall, fritekstbegrunnelse: '', dokumentIder: [{ verdi: '' }] },
    });
    const { fields, append, remove } = useFieldArray<ManuellVurderingAvVilkårSchema, 'dokumentIder'>({
        control: form.control,
        name: 'dokumentIder',
    });

    const { mutate, isPending, isError } = usePostManuellVilkårsvurderingBehandler({
        mutation: {
            onSuccess: (response) => {
                queryClient.invalidateQueries({
                    queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
                });
                onOverstyrt(response.opptjeningsvurderingId);
                lukkVurderingspanel();
            },
        },
    });

    function onSubmit({ utfall, fritekstbegrunnelse, dokumentIder }: ManuellVurderingAvVilkårSchema) {
        mutate({
            personId: personPseudoId,
            data: {
                skjæringstidspunkt,
                vilkårskode,
                utfall,
                fritekstbegrunnelse,
                journalpostId: dokumentIder.map((dokumentId) => dokumentId.verdi).filter((verdi) => verdi !== ''),
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
            <VStack gap="space-4">
                {fields.map((field, index) => (
                    <HStack key={field.id} gap="space-8" align="end">
                        <Controller
                            control={form.control}
                            name={`dokumentIder.${index}.verdi` as const}
                            rules={{
                                pattern: {
                                    value: /^\d*$/,
                                    message: 'Dokument-ID kan bare inneholde tall',
                                },
                            }}
                            render={({ field: documentField, fieldState }) => {
                                const dokumentIdFeil =
                                    fieldState.error?.message ??
                                    (/^(?:\d{1,11})?$/.test(documentField.value)
                                        ? undefined
                                        : 'Dokument-ID må være 1 til 11 siffer');

                                return (
                                    <TextField
                                        {...documentField}
                                        label={index === 0 ? 'Dokument-ID' : undefined}
                                        size="small"
                                        inputMode="numeric"
                                        pattern="[0-9]{0,11}"
                                        error={dokumentIdFeil}
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
                        Legg til flere dokument-ID
                    </Button>
                </div>
            </VStack>
            <HStack gap="space-8">
                <Button type="submit" variant="primary" size="small" loading={isPending}>
                    Lagre
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    onClick={() => {
                        lukkVurderingspanel();
                        onAvbryt();
                    }}
                >
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
