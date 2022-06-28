import { useEffect } from 'react';

import { Person } from '@io/graphql';
import { InfoAlert } from '@utils/error';
import { capitalizeName } from '@utils/locale';
import { useCurrentPerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';

const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: Person): boolean => {
    if (!personTilBehandling.tildeling) return false;
    return personTilBehandling.tildeling && personTilBehandling.tildeling.oid !== saksbehandlerOid;
};

export const useVarselOmSakErTildeltAnnenSaksbehandler = () => {
    const personTilBehandling = useCurrentPerson();
    const saksbehandler = useInnloggetSaksbehandler();

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const key = 'sak-allerede-tildelt';

    useEffect(() => {
        removeVarsel(key);
        if (personTilBehandling && erTildeltAnnenSaksbehandler(saksbehandler.oid, personTilBehandling)) {
            addVarsel(new InfoAlert(`Saken er tildelt ${capitalizeName(personTilBehandling.tildeling?.navn ?? '')}`));
        }
    }, [saksbehandler.oid, personTilBehandling]);
};
