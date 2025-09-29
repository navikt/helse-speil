import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import React, { useEffect, useState } from 'react';

import { BodyShort, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { useQuery } from '@apollo/client';
import { RestAktiveSaksbehandlereGetDocument, Saksbehandler } from '@io/graphql';
import { FilterStatus, useFilters, useToggleFilter, valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const resetValgtSaksbehandler = useResetAtom(valgtSaksbehandlerAtom);
    const toggleFilter = useToggleFilter();
    const { activeFilters } = useFilters();
    const saksbehandlere = useQuery(RestAktiveSaksbehandlereGetDocument, {
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
        saksbehandlere.data?.restAktiveSaksbehandlereGet
            .map((saksbehandler) => {
                return {
                    label: lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
                    value: JSON.stringify(saksbehandler),
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

    return (
        <VStack className={styles.sokefeltSaksbehandlere}>
            <BodyShort weight="semibold" spacing>
                Tildelte saker for:
            </BodyShort>
            <UNSAFE_Combobox
                options={saksbehandlereOptions}
                label="Saksbehandler"
                hideLabel
                size="small"
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
        </VStack>
    );
};

function lagComboboxOption(saksbehandler: Saksbehandler): ComboboxOption {
    return {
        label: lagSelectedSaksbehandlerVisningsnavn(saksbehandler),
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

function lagSelectedSaksbehandlerVisningsnavn(saksbehandler: Saksbehandler) {
    const etternavn = saksbehandler.navn.split(' ').at(0)?.replace(/,/g, '');
    return `${etternavn} - ${saksbehandler.ident}`;
}
