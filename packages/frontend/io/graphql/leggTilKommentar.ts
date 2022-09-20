import { gql, request } from 'graphql-request';

import { baseUrl } from './common';

import rawQuery from './leggTilKommentar.graphql?raw';
import { LeggTilKommentarMutation } from '@io/graphql/generated/graphql';

const leggTilKommentarMutation = gql`
    ${rawQuery}
`;

type LeggTilKommentarParams = {
    tekst: string;
    notatId: number;
    saksbehandlerident: string;
};

export const leggTilKommentar = (params: LeggTilKommentarParams): Promise<LeggTilKommentarMutation> => {
    return request(baseUrl, leggTilKommentarMutation, params);
};
