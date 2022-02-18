import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchPerson, FetchPersonQuery, Generasjon, Refusjon } from '@io/graphql';

const personGraphQLState = selectorFamily<FetchPersonQuery['person'], string>({
    key: 'personGraphQLState',
    get: (id: string) => () => {
        return fetchPerson(id).then((res) => res.person);
    },
});

export const usePersonGraphQL = (personId: string) => useRecoilValue(personGraphQLState(personId));
