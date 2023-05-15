import rawQuery from './fetchBehandledeOppgaver.graphql?raw';
import { gql, request } from 'graphql-request';

import { FetchBehandledeOppgaverQuery } from '@io/graphql/generated/graphql';

import { baseUrl } from './common';

const fetchOppgaverQuery = gql`
    ${rawQuery}
`;

type FetchBehandledeOppgaverParams = {
    oid: string;
    ident: string;
    fom: DateString;
};

export const fetchBehandledeOppgaver = (
    params: FetchBehandledeOppgaverParams,
): Promise<FetchBehandledeOppgaverQuery> => {
    return request(baseUrl, fetchOppgaverQuery, params);
};
