import settStatusAktivRawQuery from './settStatusAktiv.graphql?raw';
import settStatusVurdertRawQuery from './settStatusVurdert.graphql?raw';
import { gql, request } from 'graphql-request';

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

export const settStatusVurdert = (params: settStatusVurdertParams): Promise<Boolean> => {
    return request(baseUrl, settStatusVurdertMutation, params);
};

export const settStatusAktiv = (params: settStatusAktivParams): Promise<Boolean> => {
    return request(baseUrl, settStatusAktivMutation, params);
};
