import fjernTildelingRawQuery from './fjernTildeling.graphql?raw';
import opprettTildelingRawQuery from './opprettTildeling.graphql?raw';
import { gql, request } from 'graphql-request';

import { MutationFjernTildelingArgs, MutationOpprettTildelingArgs, Tildeling } from '@io/graphql';
import { baseUrl } from '@io/graphql/common';

const opprettTildelingMutation = gql`
    ${opprettTildelingRawQuery}
`;
const fjernTildelingMutation = gql`
    ${fjernTildelingRawQuery}
`;

interface TildelingResponse {
    opprettTildeling: Tildeling;
}

export const opprettTildeling = (params: MutationOpprettTildelingArgs): Promise<TildelingResponse> => {
    return request(baseUrl, opprettTildelingMutation, params);
};
export const fjernTildeling = (params: MutationFjernTildelingArgs): Promise<boolean> => {
    return request(baseUrl, fjernTildelingMutation, params);
};
