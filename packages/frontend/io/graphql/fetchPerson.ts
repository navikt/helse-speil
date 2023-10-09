import rawQuery from './person.query.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl, validFødselsnummer } from './common';
import { FetchPersonQuery } from './generated/graphql';

const fetchPersonQuery = gql`
    ${rawQuery}
`;

export const fetchPerson = (id: string): Promise<FetchPersonQuery> => {
    // Må spesifisere typen pga. samspillet mellom graphql-requst og query-definisjonen vår
    const variables: { aktorId?: string; fnr?: string } = validFødselsnummer(id) ? { fnr: id } : { aktorId: id };
    return request(baseUrl, fetchPersonQuery, variables);
};
