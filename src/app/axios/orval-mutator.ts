import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { customAxios } from '@app/axios/axiosClient';

export const callCustomAxios = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => customAxios(config);

export type ErrorType<Error> = AxiosError<Error>;
