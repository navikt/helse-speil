import { useEffect } from 'react';

import { Scopes, useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { capitalizeName } from '@utils/locale';
import { useCurrentPerson } from '@state/person';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Person } from '@io/graphql';

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
            addVarsel({
                key: key,
                type: 'info',
                message: `Saken er tildelt ${capitalizeName(personTilBehandling.tildeling?.navn ?? '')}`,
                scope: Scopes.SAKSBILDE,
            });
        }
    }, [saksbehandler.oid, personTilBehandling]);
};
