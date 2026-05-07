'use client';

import React, { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { UNSAFE_Combobox } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { NyDialogmeldingSchema } from '@/form-schemas/nyDialogmeldingSkjema';
import { testBehandlere } from '@saksbilde/dialogmelding/testdata';

const options: ComboboxOption[] = testBehandlere.map((b) => ({
    label: b.behandlernavn,
    value: b.behandlerId,
}));

export function BehandlerSearch(): ReactElement {
    const { control } = useFormContext<NyDialogmeldingSchema>();

    return (
        <Controller
            control={control}
            name="behandlerId"
            render={({ field, fieldState }) => (
                <UNSAFE_Combobox
                    label="Behandler"
                    description="Søk etter behandler som skal motta meldingen"
                    options={options}
                    selectedOptions={options.filter((o) => o.value === field.value)}
                    onToggleSelected={(value, isSelected) => {
                        field.onChange(isSelected ? value : '');
                    }}
                    shouldAutocomplete
                    error={fieldState.error?.message}
                />
            )}
        />
    );
}
