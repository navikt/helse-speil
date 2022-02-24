import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchPerson, FetchPersonQuery } from '@io/graphql';

const personGraphQLState = selectorFamily<FetchPersonQuery['person'], string>({
    key: 'personGraphQLState',
    get: (id: string) => () => fetchPerson(id).then((res) => res.person),
});

export const usePersonGraphQL = (personId: string) => useRecoilValue(personGraphQLState(personId));
