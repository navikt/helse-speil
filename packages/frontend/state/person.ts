import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument, Maybe } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { tildelingState } from '@state/tildeling';

export const useCurrentPerson = (): Maybe<FetchedPerson> => {
    const { aktorId } = useParams<{ aktorId?: string }>();
    const { data } = useQuery(FetchPersonDocument, {
        variables: { aktorId },
        skip: aktorId == null,
    });
    const activPeriod = useActivePeriod() as FetchedBeregnetPeriode;
    const tildelinger = useRecoilValue(tildelingState);
    const person = data?.person ?? null;
    if (person === null) return null;
    return {
        ...person,
        tildeling:
            activPeriod?.oppgave !== undefined &&
            activPeriod?.oppgave?.id !== undefined &&
            tildelinger[activPeriod.oppgave.id] !== undefined
                ? tildelinger[activPeriod.oppgave.id]
                : person?.tildeling,
    } as FetchedPerson;
};

export const useIsFetchingPerson = (): boolean => {
    const { aktorId } = useParams<{ aktorId: string | undefined }>();
    const { loading } = useQuery(FetchPersonDocument, { variables: { aktorId }, skip: aktorId == null });
    return loading;
};
