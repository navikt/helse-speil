import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { TildelingStateType, tildelingState } from '@state/tildeling';

export const useCurrentPerson = () => {
    const { aktorId } = useParams<{ aktorId?: string }>();
    const { data } = useQuery(FetchPersonDocument, {
        variables: { aktorId },
        skip: aktorId == null,
    });
    const tildelinger = useRecoilValue(tildelingState);
    return personMedTildeling(tildelinger, data?.person);
};

const personMedTildeling = (tildelinger: TildelingStateType, person: FetchPersonQuery['person']) => {
    const tildeling = finnTildeling(tildelinger, person);
    return tildeling
        ? ({
              ...person,
              tildeling: { ...tildeling },
          } as FetchedPerson)
        : person ?? null;
};

const finnTildeling = (tildelinger: TildelingStateType, person: FetchPersonQuery['person']) => {
    const aktorId = person?.aktorId;
    return aktorId ? tildelinger[aktorId]! : person?.tildeling ?? null;
};

export const useIsFetchingPerson = (): boolean => {
    const { aktorId } = useParams<{ aktorId: string | undefined }>();
    const { loading } = useQuery(FetchPersonDocument, { variables: { aktorId }, skip: aktorId == null });
    return loading;
};
