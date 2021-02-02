import { personState, useRefreshPerson } from '../state/person';
import { useRecoilValue } from 'recoil';
import { nyeOpptegnelserState } from '../state/opptegnelser';
import { OpptegnelseDTO } from 'external-types';
import { useEffect } from 'react';

const personHarFåttOpptegnelse = (opptegnelser: OpptegnelseDTO[], valgtAktørId: string) => {
    return opptegnelser.filter((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);
};

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyeOpptegnelserState);
    const valgtAktør = useRecoilValue(personState);
    const aktørId = valgtAktør?.person?.aktørId;
    const refreshPerson = useRefreshPerson();

    useEffect(() => {
        if (aktørId && personHarFåttOpptegnelse(opptegnelser, aktørId)) {
            console.log('Henter person på nytt pga. opptegnelser');
            // refreshPerson();
        }
    }, [opptegnelser]);
};
