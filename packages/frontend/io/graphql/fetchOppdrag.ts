import { gql, request } from 'graphql-request';

import { FetchOppdragQuery } from './generated/graphql';
import { baseUrl } from './common';

import rawQuery from './fetchOppdrag.graphql?raw';

const fetchOppdragQuery = gql`
    ${rawQuery}
`;

export const fetchOppdrag = (fnr: string): Promise<FetchOppdragQuery> => {
    return request(baseUrl, fetchOppdragQuery, { fnr });
};
