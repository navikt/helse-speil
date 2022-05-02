import { gql, request } from 'graphql-request';

import { FetchPersonQuery } from './generated/graphql';
import { baseUrl, validFødselsnummer } from './common';

import rawQuery from './fetchPerson.graphql?raw';

const fetchPersonQuery = gql`
    ${rawQuery}
`;

export const fetchPerson = (id: string): Promise<FetchPersonQuery> => {
    return request(baseUrl, fetchPersonQuery, validFødselsnummer(id) ? { fnr: id } : { aktorId: id });
};
