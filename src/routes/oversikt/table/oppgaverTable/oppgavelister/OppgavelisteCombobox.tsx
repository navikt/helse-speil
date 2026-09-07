import { ReactElement, Ref } from 'react';

import { Box, UNSAFE_Combobox } from '@navikt/ds-react';

import { PREDEFINERTE_OPPGAVELISTER } from '@oversikt/table/oppgaverTable/oppgavelister/predefinerteOppgavelister';
import { useOppgavelisteSokSkjema } from '@state/oppgavelister';

interface OppgavelisteComboboxProps {
    harFeil?: boolean;
    ref?: Ref<HTMLInputElement>;
}

export const OppgavelisteCombobox = ({ harFeil = false, ref }: OppgavelisteComboboxProps): ReactElement => {
    const { valgtOppgaveliste, setOppgavelisteId } = useOppgavelisteSokSkjema();

    const options = PREDEFINERTE_OPPGAVELISTER.map((liste) => ({
        label: liste.navn,
        value: liste.id,
    }));

    return (
        <Box width="200px">
            <UNSAFE_Combobox
                ref={ref}
                error={harFeil}
                label="Oppgaveliste"
                size="small"
                options={options}
                selectedOptions={valgtOppgaveliste ? options.filter((o) => o.value === valgtOppgaveliste.id) : []}
                onToggleSelected={(option, isSelected) => {
                    if (isSelected) {
                        setOppgavelisteId(option);
                    }
                }}
                shouldAutocomplete
            />
        </Box>
    );
};
