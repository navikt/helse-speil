import { useEffect } from 'react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { TildelingAlert } from '@state/oppgaver';
import { useCurrentPerson } from '@state/person';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { capitalizeName } from '@utils/locale';

const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: FetchedPerson): boolean => {
    if (!personTilBehandling.tildeling) return false;
    return personTilBehandling.tildeling && personTilBehandling.tildeling.oid !== saksbehandlerOid;
};

export const useVarselOmSakErTildeltAnnenSaksbehandler = () => {
    const personTilBehandling = useCurrentPerson();
    const saksbehandler = useInnloggetSaksbehandler();

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const key = 'tildeling';

    useEffect(() => {
        removeVarsel(key);
        if (personTilBehandling && erTildeltAnnenSaksbehandler(saksbehandler.oid, personTilBehandling)) {
            addVarsel(
                new TildelingAlert(`Saken er tildelt ${capitalizeName(personTilBehandling.tildeling?.navn ?? '')}`),
            );
        }
    }, [saksbehandler.oid, personTilBehandling]);
};
