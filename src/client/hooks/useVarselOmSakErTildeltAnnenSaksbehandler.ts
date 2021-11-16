import { useEffect } from 'react';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { Scopes, useAddVarsel, useRemoveVarsel } from '../state/varsler';
import { capitalizeName } from '../utils/locale';

const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: Person): boolean => {
    if (!personTilBehandling.tildeling) return false;
    return personTilBehandling.tildeling && personTilBehandling.tildeling.saksbehandler.oid !== saksbehandlerOid;
};

export const useVarselOmSakErTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: Person) => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const key = 'sak-allerede-tildelt';

    useEffect(() => {
        removeVarsel(key);
        if (erTildeltAnnenSaksbehandler(saksbehandlerOid, personTilBehandling)) {
            addVarsel({
                key: key,
                type: Varseltype.Info,
                message: `Saken er allerede tildelt til ${capitalizeName(
                    personTilBehandling.tildeling?.saksbehandler.navn ?? ''
                )}`,
                scope: Scopes.SAKSBILDE,
            });
        }
    }, [saksbehandlerOid, personTilBehandling.aktørId]);
};
