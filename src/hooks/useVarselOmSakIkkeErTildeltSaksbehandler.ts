import { useEffect } from 'react';

import { useCurrentPerson } from '@person/query';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

export const useVarselOmSakIkkeErTildeltSaksbehandler = () => {
    const personTilBehandling = useCurrentPerson();

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const key = 'sak-ikke-tildelt';

    useEffect(() => {
        removeVarsel(key);
        if (personTilBehandling && personTilBehandling.tildeling === null) {
            addVarsel(new InfoAlert(`Du må tildele deg saken for å kunne behandle den`));
        }
    }, [personTilBehandling]);
};
