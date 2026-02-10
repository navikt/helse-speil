import { AxiosRequestConfig } from 'axios';

import { customAxios } from '@app/axios/axiosClient';

export type ErrorType<Error> = { message: string; status: number; response: { status: number; data: Error } };

export async function callCustomAxios<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const res = await customAxios<T>(config);
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        // Errors mappes om for å unngå at serialiseringen av innholdet i query cache til Tanstack Dev Tools kræsjer
        throw {
            message: e?.message,
            status: e.status ?? e.response.status,
            response: {
                status: e.response.status ?? e.status,
                data: e.response.data,
            },
        } as ErrorType<T>;
    }
}
