import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { customAxios } from '@app/axios/axiosClient';

export type ErrorType<Error> = AxiosError<Error>;

export async function callCustomAxios<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const res = await customAxios<T>(config);
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        // Errors mappes om for å unngå at serialiseringen av innholdet i query cache til Tanstack Dev Tools kræsjer
        if (axios.isAxiosError(e)) {
            throw {
                name: 'AxiosError',
                message: e.message,
                status: e.response?.status,
                data: e.response?.data,
                url: e.config?.url,
                method: e.config?.method,
            };
        }
        throw { name: 'Error', message: String(e) };
    }
}
