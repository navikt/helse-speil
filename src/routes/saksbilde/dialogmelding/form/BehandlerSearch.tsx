'use client';

import React, { ReactElement, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { UNSAFE_Combobox } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { NyDialogmeldingSchema } from '@/form-schemas/nyDialogmeldingSkjema';
import { isyfoBehandlerToApiBehandler } from '@external/isyfo/isyfoBehandlerToApiBehandler';
import { IsyfoBehandler, useBehandlerSearch } from '@external/isyfo/useBehandlerSearch';

export function BehandlerSearch(): ReactElement {
    const { control } = useFormContext<NyDialogmeldingSchema>();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const { data: behandlere, isFetching } = useBehandlerSearch(debouncedSearchTerm);

    const options: ComboboxOption[] = (behandlere ?? []).map(behandlerTilOption);

    return (
        <Controller
            control={control}
            name="behandler"
            render={({ field, fieldState }) => (
                <UNSAFE_Combobox
                    label="Behandler"
                    description="Søk etter behandler som skal motta meldingen"
                    options={options}
                    selectedOptions={options.filter((o) => o.value === field.value?.id)}
                    onToggleSelected={(value, isSelected) => {
                        if (isSelected) {
                            const selected = behandlere?.find((b) => b.behandlerRef === value);
                            if (selected) {
                                field.onChange(isyfoBehandlerToApiBehandler(selected));
                            }
                        } else {
                            field.onChange(undefined);
                        }
                    }}
                    onChange={(value) => setSearchTerm(value)}
                    isLoading={isFetching}
                    shouldAutocomplete
                    error={fieldState.error?.message}
                />
            )}
        />
    );
}

function behandlerTilOption(behandler: IsyfoBehandler): ComboboxOption {
    const navn = [behandler.fornavn, behandler.mellomnavn, behandler.etternavn].filter(Boolean).join(' ');
    const label = behandler.kontor ? `${navn} — ${behandler.kontor}` : navn;
    return { label, value: behandler.behandlerRef };
}
