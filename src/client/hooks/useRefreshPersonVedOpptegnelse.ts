import { personState, useRefreshPerson } from '../state/person';
import { useRecoilValue } from 'recoil';
import { nyeOpptegnelserState } from '../state/opptegnelser';
import { OpptegnelseDTO } from 'external-types';
import { useEffect } from 'react';

const personHarFåttOpptegnelse = (opptegnelser: OpptegnelseDTO[], valgtAktørId: string): boolean =>
    opptegnelser.filter((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId).length > 0;

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyeOpptegnelserState);
    const valgtAktør = useRecoilValue(personState);
    const aktørId = valgtAktør?.person?.aktørId;
    const refreshPerson = useRefreshPerson();

    useEffect(() => {
        if (aktørId && personHarFåttOpptegnelse(opptegnelser, aktørId)) {
            refreshPerson();
        }
    }, [opptegnelser]);
};
