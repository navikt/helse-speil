import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { nyesteOpptegnelserState } from '@state/opptegnelser';
import { useFetchPersonQuery } from '@state/person';

const personHarFåttOpptegnelse = (opptegnelser: Opptegnelse[], valgtAktørId: string): boolean =>
    opptegnelser.some((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const { data, refetch } = useFetchPersonQuery();

    useEffect(() => {
        if (data !== undefined && data.person?.aktorId && personHarFåttOpptegnelse(opptegnelser, data.person.aktorId)) {
            void refetch();
        }
    }, [opptegnelser]);
};
