import { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { PREDEFINERTE_OPPGAVELISTER } from '@oversikt/table/oppgaverTable/oppgavelister/predefinerteOppgavelister';
import { useAktivOppgaveliste, useSetAktivOppgaveliste } from '@state/oppgavelister';

export const OppgavelisteChips = (): ReactElement => {
    const aktivOppgaveliste = useAktivOppgaveliste();
    const setAktivOppgaveliste = useSetAktivOppgaveliste();

    return (
        <Chips className="mx-3 mt-3 mb-2">
            {PREDEFINERTE_OPPGAVELISTER.map((liste) => (
                <Chips.Toggle
                    key={liste.id}
                    selected={aktivOppgaveliste.id === liste.id}
                    onClick={() => setAktivOppgaveliste(liste.id)}
                >
                    {liste.navn}
                </Chips.Toggle>
            ))}
        </Chips>
    );
};
