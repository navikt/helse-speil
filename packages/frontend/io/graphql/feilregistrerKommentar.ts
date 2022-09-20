import { gql, request } from 'graphql-request';

import { baseUrl } from '@io/graphql/common';

import rawQuery from './feilregistrerKommentar.graphql?raw';

const feilregistrerKommentarMutation = gql`
    ${rawQuery}
`;

export const feilregistrerKommentar = (id: number): Promise<Boolean> => {
    return request(baseUrl, feilregistrerKommentarMutation, { id });
};
