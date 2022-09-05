import { gql, request } from 'graphql-request';
import { baseUrl } from '@io/graphql/common';

import rawQuery from './fetchBehandlingsstatistikk.graphql?raw';

const fetchBehandlingsstatistikkQuery = gql`
    ${rawQuery}
`;

export const fetchBehandlingsstatistikk = () => {
    return request(baseUrl, fetchBehandlingsstatistikkQuery);
};
