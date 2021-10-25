import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { nyesteOpptegnelserState } from '../state/opptegnelser';
import { personState, useRefreshPerson } from '../state/person';

const personHarFåttOpptegnelse = (opptegnelser: Opptegnelse[], valgtAktørId: string): boolean =>
    opptegnelser.some((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const valgtAktør = useRecoilValue(personState);
    const aktørId = valgtAktør?.person?.aktørId;
    const refreshPerson = useRefreshPerson();

    useEffect(() => {
        if (aktørId && personHarFåttOpptegnelse(opptegnelser, aktørId)) {
            refreshPerson();
        }
    }, [opptegnelser]);
};
