import settVarselstatusAktivRawQuery from './settVarselstatusAktiv.graphql?raw';
import settVarselstatusVurdertRawQuery from './settVarselstatusVurdert.graphql?raw';
import { gql, request } from 'graphql-request';

import { SettVarselstatusAktivMutation, SettVarselstatusVurdertMutation } from '@io/graphql/generated/graphql';

import { baseUrl } from './common';

const settVarselstatusVurdertMutation = gql`
    ${settVarselstatusVurdertRawQuery}
`;

const settVarselstatusAktivMutation = gql`
    ${settVarselstatusAktivRawQuery}
`;

type SettVarselstatusVurdertParams = {
    generasjonIdString: string;
    definisjonIdString: string;
    varselkode: string;
    ident: string;
};

type SettVarselstatusAktivParams = {
    generasjonIdString: string;
    varselkode: string;
    ident: string;
};

export const settVarselstatusVurdert = (
    params: SettVarselstatusVurdertParams
): Promise<SettVarselstatusVurdertMutation> => {
    return request(baseUrl, settVarselstatusVurdertMutation, params);
};

export const settVarselstatusAktiv = (params: SettVarselstatusAktivParams): Promise<SettVarselstatusAktivMutation> => {
    return request(baseUrl, settVarselstatusAktivMutation, params);
};
