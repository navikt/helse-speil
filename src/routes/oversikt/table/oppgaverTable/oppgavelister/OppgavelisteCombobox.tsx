import { ReactElement } from 'react';

import { Box, UNSAFE_Combobox } from '@navikt/ds-react';

import { PREDEFINERTE_OPPGAVELISTER } from '@oversikt/table/oppgaverTable/oppgavelister/predefinerteOppgavelister';
import { useAktivOppgaveliste, useSetAktivOppgaveliste } from '@state/oppgavelister';

export const OppgavelisteCombobox = (): ReactElement => {
    const aktivOppgaveliste = useAktivOppgaveliste();
    const setAktivOppgaveliste = useSetAktivOppgaveliste();

    const options = PREDEFINERTE_OPPGAVELISTER.map((liste) => ({
        label: liste.navn,
        value: liste.id,
    }));

    return (
        <Box width="200px">
            <UNSAFE_Combobox
                label="Oppgaveliste"
                size="small"
                options={options}
                selectedOptions={aktivOppgaveliste ? options.filter((o) => o.value === aktivOppgaveliste.id) : []}
                onToggleSelected={(option, isSelected) => {
                    if (isSelected) {
                        setAktivOppgaveliste(option);
                    }
                }}
                shouldAutocomplete
            />
        </Box>
    );
};
