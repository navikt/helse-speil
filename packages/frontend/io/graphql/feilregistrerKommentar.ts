import rawQuery from './feilregistrerKommentar.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl } from '@io/graphql/common';

const feilregistrerKommentarMutation = gql`
    ${rawQuery}
`;

export const feilregistrerKommentar = (id: number): Promise<number> => {
    return request(baseUrl, feilregistrerKommentarMutation, { id });
};
