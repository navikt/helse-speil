import rawQuery from './fetchBehandlingsstatistikk.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl } from '@io/graphql/common';
import { HentBehandlingsstatistikkQuery } from '@io/graphql/generated/graphql';

const fetchBehandlingsstatistikkQuery = gql`
    ${rawQuery}
`;

export const fetchBehandlingsstatistikk = (): Promise<HentBehandlingsstatistikkQuery> => {
    return request(baseUrl, fetchBehandlingsstatistikkQuery);
};
