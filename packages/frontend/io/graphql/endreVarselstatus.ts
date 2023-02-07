import settStatusAktivRawQuery from './settStatusAktiv.graphql?raw';
import settStatusVurdertRawQuery from './settStatusVurdert.graphql?raw';
import settVarselstatusAktivRawQuery from './settVarselstatusAktiv.graphql?raw';
import settVarselstatusVurdertRawQuery from './settVarselstatusVurdert.graphql?raw';
import { gql, request } from 'graphql-request';

import {
    SettStatusAktivMutation,
    SettStatusVurdertMutation,
    SettVarselstatusAktivMutation,
    SettVarselstatusVurdertMutation,
} from '@io/graphql/generated/graphql';

import { baseUrl } from './common';

const settStatusVurdertMutation = gql`
    ${settStatusVurdertRawQuery}
`;

const settVarselstatusVurdertMutation = gql`
    ${settVarselstatusVurdertRawQuery}
`;

const settStatusAktivMutation = gql`
    ${settStatusAktivRawQuery}
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

export const settStatusVurdert = (params: SettVarselstatusVurdertParams): Promise<SettStatusVurdertMutation> => {
    return request(baseUrl, settStatusVurdertMutation, params);
};

export const settVarselstatusVurdert = (
    params: SettVarselstatusVurdertParams
): Promise<SettVarselstatusVurdertMutation> => {
    return request(baseUrl, settVarselstatusVurdertMutation, params);
};

export const settStatusAktiv = (params: SettVarselstatusAktivParams): Promise<SettStatusAktivMutation> => {
    return request(baseUrl, settStatusAktivMutation, params);
};

export const settVarselstatusAktiv = (params: SettVarselstatusAktivParams): Promise<SettVarselstatusAktivMutation> => {
    return request(baseUrl, settVarselstatusAktivMutation, params);
};
