import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument, Tildeling } from '@io/graphql';
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
    if (!person) return null;
    const tildeling = finnTildeling(tildelinger, person);
    return {
        ...person,
        tildeling: tildeling ? { ...tildeling } : null,
    } as FetchedPerson;
};

const finnTildeling = (tildelinger: TildelingStateType, person: NonNullable<FetchPersonQuery['person']>) => {
    const tildelingOverlay: Tildeling | null | undefined = tildelinger[person.aktorId];
    return tildelingOverlay !== undefined ? tildelingOverlay : person?.tildeling;
};

export const useIsFetchingPerson = (): boolean => {
    const { aktorId } = useParams<{ aktorId: string | undefined }>();
    const { loading } = useQuery(FetchPersonDocument, { variables: { aktorId }, skip: aktorId == null });
    return loading;
};
