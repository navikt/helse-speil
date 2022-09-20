import { gql, request } from 'graphql-request';

import { baseUrl } from '@io/graphql/common';

import rawQuery from './feilregistrerNotat.graphql?raw';

const feilregistrerNotatMutation = gql`
    ${rawQuery}
`;

export const feilregistrerNotat = (): Promise<Boolean> => {
    return request(baseUrl, feilregistrerNotatMutation);
};
