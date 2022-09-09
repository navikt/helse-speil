import { gql, request } from 'graphql-request';

import { FetchFerdigstilteOppgaverQuery } from '@io/graphql/generated/graphql';
import { baseUrl } from './common';

import rawQuery from './fetchFerdigstilteOppgaver.graphql?raw';

const fetchOppgaverQuery = gql`
    ${rawQuery}
`;

export const fetchFerdigstilteOppgaver = (ident: string, fom: DateString): Promise<FetchFerdigstilteOppgaverQuery> => {
    return request(baseUrl, fetchOppgaverQuery, { ident, fom });
};
