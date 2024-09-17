import { useEffect } from 'react';

import { PersonFragment } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { TildelingAlert } from '@state/oppgaver';
import { useFetchPersonQuery } from '@state/person';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { capitalizeName } from '@utils/locale';

const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: PersonFragment): boolean => {
    if (!personTilBehandling.tildeling) return false;
    return personTilBehandling.tildeling && personTilBehandling.tildeling.oid !== saksbehandlerOid;
};

export const useVarselOmSakErTildeltAnnenSaksbehandler = () => {
    const { data } = useFetchPersonQuery();
    const personTilBehandling = data?.person ?? null;
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
