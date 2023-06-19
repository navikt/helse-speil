import fjernPåVentRawQuery from './fjernPåVent.graphql?raw';
import fjernTildelingRawQuery from './fjernTildeling.graphql?raw';
import leggPåVentRawQuery from './leggPåVent.graphql?raw';
import opprettTildelingRawQuery from './opprettTildeling.graphql?raw';
import { gql, request } from 'graphql-request';

import {
    MutationFjernPaaVentArgs,
    MutationFjernTildelingArgs,
    MutationLeggPaaVentArgs,
    MutationOpprettTildelingArgs,
    Tildeling,
} from '@io/graphql';
import { baseUrl } from '@io/graphql/common';

const opprettTildelingMutation = gql`
    ${opprettTildelingRawQuery}
`;
const fjernTildelingMutation = gql`
    ${fjernTildelingRawQuery}
`;
const leggPåVentMutation = gql`
    ${leggPåVentRawQuery}
`;
const fjernPåVentMutation = gql`
    ${fjernPåVentRawQuery}
`;

interface TildelingResponse {
    opprettTildeling: Tildeling;
}

interface LeggPåVentResponse {
    leggPaaVent: Tildeling;
}

interface FjernPåVentResponse {
    fjernPaaVent: Tildeling;
}

export const opprettTildeling = (params: MutationOpprettTildelingArgs): Promise<TildelingResponse> => {
    return request(baseUrl, opprettTildelingMutation, params);
};
export const fjernTildeling = (params: MutationFjernTildelingArgs): Promise<boolean> => {
    return request(baseUrl, fjernTildelingMutation, params);
};

export const leggPåVent = (params: MutationLeggPaaVentArgs): Promise<LeggPåVentResponse> => {
    return request(baseUrl, leggPåVentMutation, params);
};
export const fjernPåVent = (params: MutationFjernPaaVentArgs): Promise<FjernPåVentResponse> => {
    return request(baseUrl, fjernPåVentMutation, params);
};
