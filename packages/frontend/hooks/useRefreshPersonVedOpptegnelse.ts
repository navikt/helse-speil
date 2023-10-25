import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { FetchPersonDocument } from '@io/graphql';
import { nyesteOpptegnelserState } from '@state/opptegnelser';
import { useFetchPersonQuery } from '@state/person';

import { client } from '../routes/apolloClient';

const personHarFåttOpptegnelse = (opptegnelser: Opptegnelse[], valgtAktørId: string): boolean =>
    opptegnelser.some((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const { data } = useFetchPersonQuery();

    useEffect(() => {
        if (data !== undefined && data.person?.aktorId && personHarFåttOpptegnelse(opptegnelser, data.person.aktorId)) {
            client.refetchQueries({ include: [FetchPersonDocument] });
        }
    }, [opptegnelser]);
};
