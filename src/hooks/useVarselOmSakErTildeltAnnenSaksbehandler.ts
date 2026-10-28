import { useEffect } from 'react';

import { ApiTildeling } from '@io/rest/generated/spesialist.schemas';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { TildelingAlert } from '@state/oppgaver';
import { useTildeling } from '@state/tildeling';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { capitalizeName } from '@utils/locale';

export const useVarselOmSakErTildeltAnnenSaksbehandler = () => {
    const tildeling = useTildeling();
    const saksbehandler = useInnloggetSaksbehandler();

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const key = 'tildeling';

    useEffect(() => {
        removeVarsel(key);
        if (tildeling && erTildeltAnnenSaksbehandler(saksbehandler.oid, tildeling)) {
            addVarsel(new TildelingAlert(capitalizeName(tildeling.navn)));
        }
    }, [saksbehandler.oid, tildeling, removeVarsel, addVarsel]);
};

const erTildeltAnnenSaksbehandler = (saksbehandlerOid: string, tildeling: ApiTildeling): boolean =>
    tildeling.oid !== saksbehandlerOid;
