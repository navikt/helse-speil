import rawQuery from './fetchOppgaver.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl } from './common';
import { FetchOppgaverQuery } from './generated/graphql';

const fetchOppgaverQuery = gql`
    ${rawQuery}
`;

export const fetchOppgaver = (): Promise<FetchOppgaverQuery> => {
    return request(baseUrl, fetchOppgaverQuery);
};
