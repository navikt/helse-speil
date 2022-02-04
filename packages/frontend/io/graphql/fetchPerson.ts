import { gql, request } from 'graphql-request';

import rawQuery from './fetchPersonQuery.graphql?raw';

const baseUrlGraphQL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql';

const fetchPersonQuery = gql`
    ${rawQuery}
`;

export const fetchPerson = (fødselsnummer: string) => {
    return request(baseUrlGraphQL, fetchPersonQuery, { fnr: fødselsnummer });
};
