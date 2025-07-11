import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import React, { useEffect, useState } from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { useQuery } from '@apollo/client';
import { HentSaksbehandlereDocument, Saksbehandler } from '@io/graphql';
import { valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const resetValgtSaksbehandler = useResetAtom(valgtSaksbehandlerAtom);
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

    const saksbehandlereOptions =
        saksbehandlere.data?.hentSaksbehandlere.map((saksbehandler) => {
            return {
                label: `${saksbehandler.navn} - ${saksbehandler.ident}`,
                value: JSON.stringify(saksbehandler),
            };
        }) ?? [];

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
                } else {
                    setValgtSaksbehandler(lagSaksbehandler(option));
                }
            }}
        />
    );
};

function lagComboboxOption(saksbehandler: Saksbehandler): ComboboxOption {
    return {
        label: `${saksbehandler.navn} - ${saksbehandler.ident}`,
        value: JSON.stringify(saksbehandler),
    };
}

function lagSaksbehandler(saksbehandler: string): Saksbehandler {
    return {
        __typename: 'Saksbehandler',
        ...JSON.parse(saksbehandler),
    };
}
