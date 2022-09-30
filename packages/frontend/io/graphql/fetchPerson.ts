import rawQuery from './fetchPerson.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl, validFødselsnummer } from './common';
import { FetchPersonQuery } from './generated/graphql';

const fetchPersonQuery = gql`
    ${rawQuery}
`;

export const fetchPerson = (id: string): Promise<FetchPersonQuery> => {
    return request(baseUrl, fetchPersonQuery, validFødselsnummer(id) ? { fnr: id } : { aktorId: id });
};
