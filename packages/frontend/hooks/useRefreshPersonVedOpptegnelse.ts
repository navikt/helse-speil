import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { nyesteOpptegnelserState } from '@state/opptegnelser';
import { usePersonLoadable, useRefetchPerson } from '@state/person';

const personHarFåttOpptegnelse = (opptegnelser: Opptegnelse[], valgtAktørId: string): boolean =>
    opptegnelser.some((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const currentPerson = usePersonLoadable();
    const refetchPerson = useRefetchPerson();

    useEffect(() => {
        if (
            currentPerson.state === 'hasValue' &&
            currentPerson.contents?.aktorId &&
            personHarFåttOpptegnelse(opptegnelser, currentPerson.contents.aktorId)
        ) {
            refetchPerson();
        }
    }, [opptegnelser]);
};
