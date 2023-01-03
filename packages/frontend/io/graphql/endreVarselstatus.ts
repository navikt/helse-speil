import settStatusAktivRawQuery from './settStatusAktiv.graphql?raw';
import settStatusVurdertRawQuery from './settStatusVurdert.graphql?raw';
import { gql, request } from 'graphql-request';

import { SettStatusAktivMutation, SettStatusVurdertMutation } from '@io/graphql/generated/graphql';

import { baseUrl } from './common';

const settStatusVurdertMutation = gql`
    ${settStatusVurdertRawQuery}
`;

const settStatusAktivMutation = gql`
    ${settStatusAktivRawQuery}
`;

type settStatusVurdertParams = {
    generasjonId: string;
    definisjonId: string;
    varselkode: string;
    ident: string;
};

type settStatusAktivParams = {
    generasjonId: string;
    varselkode: string;
    ident: string;
};

export const settStatusVurdert = (params: settStatusVurdertParams): Promise<SettStatusVurdertMutation> => {
    return request(baseUrl, settStatusVurdertMutation, params);
};

export const settStatusAktiv = (params: settStatusAktivParams): Promise<SettStatusAktivMutation> => {
    return request(baseUrl, settStatusAktivMutation, params);
};
