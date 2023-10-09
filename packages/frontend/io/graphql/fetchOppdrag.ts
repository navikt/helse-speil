import rawQuery from './fetchOppdrag.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl } from './common';
import { FetchOppdragQuery } from './generated/graphql';

const fetchOppdragQuery = gql`
    ${rawQuery}
`;

export const fetchOppdrag = (fnr: string): Promise<FetchOppdragQuery> => {
    return request(baseUrl, fetchOppdragQuery, { fnr });
};
