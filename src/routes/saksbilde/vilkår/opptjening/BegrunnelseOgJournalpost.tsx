import React, { ReactElement } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button, HStack, Radio, RadioGroup, TextField, Textarea, VStack } from '@navikt/ds-react';

import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { BegrunnelseOgJournalpostSchema, Journalpostvalg } from '@form-schemas/opptjeningSkjema';

export function BegrunnelseOgJournalpost(): ReactElement {
    const { control } = useFormContext<BegrunnelseOgJournalpostSchema>();
    const skalLeggeTilJournalpost =
        useWatch({ control, name: 'journalpostvalg' }) === Journalpostvalg.LEGG_TIL_JOURNALPOST;
    const { fields, append, remove } = useFieldArray<BegrunnelseOgJournalpostSchema, 'journalpostIder'>({
        control,
        name: 'journalpostIder',
    });

    return (
        <>
            <Controller
                control={control}
                name="journalpostvalg"
                render={({ field, fieldState }) => (
                    <RadioGroup
                        {...field}
                        legend="Journalpost-ID"
                        description="Velg om du vil legge til en journalpost-ID eller vurdere at saken er godt nok opplyst i Speil"
                        size="small"
                        error={fieldState.error?.message}
                    >
                        <Radio
                            value={Journalpostvalg.OPPLYST_I_SPEIL}
                            description="Velg dette alternativet hvis saken allerede er godt nok opplyst i Speil uten at en journalpost-ID må legges til"
                        >
                            Saken er godt nok opplyst i Speil
                        </Radio>
                        <Radio
                            value={Journalpostvalg.LEGG_TIL_JOURNALPOST}
                            description="Bruk dette alternativet hvis det er nødvendig å legge til en journalpost-ID i saken"
                        >
                            Legg til journalpost-ID
                        </Radio>
                    </RadioGroup>
                )}
            />
            {skalLeggeTilJournalpost && (
                <VStack gap="space-4">
                    {fields.map((field, index) => (
                        <HStack key={field.id} gap="space-8" align="end">
                            <Controller
                                control={control}
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
            )}
            <Controller
                control={control}
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
        </>
    );
}
