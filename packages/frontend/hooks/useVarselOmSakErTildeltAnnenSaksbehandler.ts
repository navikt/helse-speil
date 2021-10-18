import { useEffect } from 'react';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { Scopes, useAddVarsel } from '../state/varsler';
import { capitalizeName } from '../utils/locale';

export const useVarselOmSakErTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: Person) => {
    const addVarsel = useAddVarsel();

    const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, personTilBehandling: Person): boolean => {
        if (!personTilBehandling.tildeling) return false;
        return personTilBehandling.tildeling && personTilBehandling.tildeling.saksbehandler.oid !== saksbehandlerOid;
    };

    useEffect(() => {
        if (erTildeltAnnenSaksbehandler(saksbehandlerOid, personTilBehandling)) {
            addVarsel({
                key: saksbehandlerOid + personTilBehandling.aktørId,
                type: Varseltype.Info,
                message: `Saken er allerede tildelt til ${capitalizeName(
                    personTilBehandling.tildeling?.saksbehandler.navn ?? ''
                )}`,
                scope: Scopes.SAKSBILDE,
            });
        }
    }, [saksbehandlerOid, personTilBehandling.aktørId]);
};
