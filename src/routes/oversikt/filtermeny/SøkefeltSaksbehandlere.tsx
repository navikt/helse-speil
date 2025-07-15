import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import React, { useEffect, useState } from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { useQuery } from '@apollo/client';
import { HentSaksbehandlereDocument, Saksbehandler } from '@io/graphql';
import { FilterStatus, useFilters, useToggleFilter, valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const resetValgtSaksbehandler = useResetAtom(valgtSaksbehandlerAtom);
    const toggleFilter = useToggleFilter();
    const { activeFilters } = useFilters();
    const saksbehandlere = useQuery(HentSaksbehandlereDocument, {
        nextFetchPolicy: 'cache-first',
    });
    const [selected, setSelected] = useState<ComboboxOption[] | undefined>(
        valgtSaksbehandler !== null ? [lagComboboxOption(valgtSaksbehandler)] : undefined,
    );

    useEffect(
        () => (valgtSaksbehandler ? setSelected([lagComboboxOption(valgtSaksbehandler)]) : setSelected([])),
        [valgtSaksbehandler],
    );

    useEffect(() => {
        if (!activeFilters.map((filter) => filter.key.toLowerCase()).includes('saksbehandler')) {
            resetValgtSaksbehandler();
        }
    }, [activeFilters, resetValgtSaksbehandler]);

    const saksbehandlereOptions =
        saksbehandlere.data?.hentSaksbehandlere
            .map((saksbehandler) => {
                return {
                    label: lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
                    value: JSON.stringify(saksbehandler),
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

    return (
        <UNSAFE_Combobox
            options={saksbehandlereOptions}
            label="Saksbehandler"
            size="small"
            className={styles.sokefeltSaksbehandlere}
            selectedOptions={selected}
            onToggleSelected={(option, isSelected) => {
                if (!isSelected) {
                    resetValgtSaksbehandler();
                    toggleFilter('SAKSBEHANDLER', FilterStatus.OFF);
                } else {
                    const saksbehandler = lagSaksbehandler(option);
                    setValgtSaksbehandler(saksbehandler);
                    toggleFilter(
                        'SAKSBEHANDLER',
                        FilterStatus.PLUS,
                        lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
                    );
                }
            }}
        />
    );
};

function lagComboboxOption(saksbehandler: Saksbehandler): ComboboxOption {
    return {
        label: lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
        value: JSON.stringify(saksbehandler),
    };
}

function lagSaksbehandler(saksbehandler: string): Saksbehandler {
    return {
        __typename: 'Saksbehandler',
        ...JSON.parse(saksbehandler),
    };
}

function lagOppslåttSaksbehandlerVisningsnavn(saksbehandler: Saksbehandler) {
    return `${saksbehandler.navn} - ${saksbehandler.ident}`;
}
