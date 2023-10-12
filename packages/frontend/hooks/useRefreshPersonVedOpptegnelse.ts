import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { nyesteOpptegnelserState } from '@state/opptegnelser';

import { client } from '../routes/apolloClient';

const personHarFåttOpptegnelse = (opptegnelser: Opptegnelse[], valgtAktørId: string): boolean =>
    opptegnelser.some((opptegnelse) => opptegnelse.aktørId.toString() === valgtAktørId);

export const useRefreshPersonVedOpptegnelse = () => {
    const opptegnelser = useRecoilValue(nyesteOpptegnelserState);
    const { aktorId } = useParams<{ aktorId: string }>();
    const { data } = useQuery(FetchPersonDocument, { variables: { aktorId } });

    useEffect(() => {
        if (data !== undefined && data.person?.aktorId && personHarFåttOpptegnelse(opptegnelser, data.person.aktorId)) {
            client.refetchQueries({ include: [FetchPersonDocument] });
        }
    }, [opptegnelser]);
};
