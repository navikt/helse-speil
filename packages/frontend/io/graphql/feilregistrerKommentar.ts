import rawQuery from './feilregistrerKommentar.graphql?raw';
import { gql, request } from 'graphql-request';

import { baseUrl } from '@io/graphql/common';

const feilregistrerKommentarMutation = gql`
    ${rawQuery}
`;

export const feilregistrerKommentar = (id: number): Promise<boolean> => {
    return request(baseUrl, feilregistrerKommentarMutation, { id });
};
