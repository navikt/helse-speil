import { useAtom } from 'jotai';
import React from 'react';

import { BodyShort, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { useQuery } from '@apollo/client';
import { AktivSaksbehandler, RestGetAktiveSaksbehandlereDocument } from '@io/graphql';
import { valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const saksbehandlere = useQuery(RestGetAktiveSaksbehandlereDocument, {
        nextFetchPolicy: 'cache-first',
    });

    const saksbehandlereOptions: ComboboxOption[] =
        saksbehandlere.data?.restGetAktiveSaksbehandlere
            .map((saksbehandler) => ({
                label: lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
                value: saksbehandler.oid,
            }))
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
                selectedOptions={saksbehandlereOptions.filter(
                    (saksbehandler) => saksbehandler.value === valgtSaksbehandler?.oid,
                )}
                onToggleSelected={(option, isSelected) => {
                    if (!isSelected) {
                        setValgtSaksbehandler(null);
                    } else {
                        const saksbehandler =
                            saksbehandlere.data?.restGetAktiveSaksbehandlere?.find(
                                (saksbehandler) => saksbehandler.oid === option,
                            ) ?? null;
                        setValgtSaksbehandler(saksbehandler);
                    }
                }}
            />
        </VStack>
    );
};

export function lagOppslåttSaksbehandlerVisningsnavn(saksbehandler: AktivSaksbehandler) {
    return `${saksbehandler.navn} - ${saksbehandler.ident}`;
}
