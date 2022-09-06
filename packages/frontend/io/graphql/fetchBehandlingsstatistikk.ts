import { gql, request } from 'graphql-request';

import { HentBehandlingsstatistikkQuery } from '@io/graphql/generated/graphql';
import { baseUrl } from '@io/graphql/common';

import rawQuery from './fetchBehandlingsstatistikk.graphql?raw';

const fetchBehandlingsstatistikkQuery = gql`
    ${rawQuery}
`;

export const fetchBehandlingsstatistikk = (): Promise<HentBehandlingsstatistikkQuery> => {
    return request(baseUrl, fetchBehandlingsstatistikkQuery);
};
