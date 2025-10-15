import { useAtom } from 'jotai';
import React from 'react';

import { BodyShort, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
// @ts-expect-error TS klager på at den ikke finner modulen med combobox-typen selv om den resolver
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

import { useGetAktiveSaksbehandlere } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiAktivSaksbehandler } from '@io/rest/generated/spesialist.schemas';
import { valgtSaksbehandlerAtom } from '@oversikt/table/state/filter';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const { data: response } = useGetAktiveSaksbehandlere({ query: { gcTime: 60000 } });
    const aktiveSaksbehandlere = response?.data;

    const saksbehandlereOptions: ComboboxOption[] =
        aktiveSaksbehandlere
            ?.map((saksbehandler) => ({
                label: lagOppslåttSaksbehandlerVisningsnavn(saksbehandler),
                value: saksbehandler.oid,
            }))
            ?.sort((a, b) => a.label.localeCompare(b.label)) ?? [];

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
                        setValgtSaksbehandler(aktiveSaksbehandlere?.find((s) => s.oid === option) ?? null);
                    }
                }}
            />
        </VStack>
    );
};

export function lagOppslåttSaksbehandlerVisningsnavn(saksbehandler: ApiAktivSaksbehandler) {
    return `${saksbehandler.navn} - ${saksbehandler.ident}`;
}
