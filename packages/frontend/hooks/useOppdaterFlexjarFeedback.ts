import { v4 as uuidv4 } from 'uuid';

import { FetchError } from '@io/graphql/errors';
import { useMutation } from '@tanstack/react-query';

const basePath = 'https://flexjar-backend.flex';

export function UseOppdaterFlexjarFeedback() {
    return useMutation<unknown, Error, OppdaterFlexjarFeedbackRequest>({
        mutationFn: async (req) => {
            return fetchMedRequestId(`${basePath}/api/flexjar-backend/api/v2/feedback/${req.id}`, {
                method: 'PUT',
                body: JSON.stringify(req.body),

                headers: {
                    'Content-Type': 'application/json',
                },
            });
        },
        onSuccess: async (_, req) => {
            req.cb?.();
        },
    });
}

interface OppdaterFlexjarFeedbackRequest {
    id: string;
    body: object;
    cb?: () => void;
}

export type FetchResult = { requestId: string; response: Response };
export type ErrorHandler = (result: Response, requestId: string, defaultErrorHandler: () => void) => void;
export const fetchMedRequestId = async (
    url: string,
    options: RequestInit = {},
    errorHandler?: ErrorHandler,
): Promise<FetchResult> => {
    const requestId = uuidv4();

    options.headers = options.headers
        ? { ...options.headers, 'x-request-id': requestId }
        : { 'x-request-id': requestId };

    const fetchUrl = async () => {
        try {
            return await fetch(url, options);
        } catch (e) {
            throw new FetchError(
                `${e} - Kall til url: ${options.method} ${url} og x_request_id: ${requestId} feilet uten svar fra backend.`,
            );
        }
    };

    const response = await fetchUrl();

    if (response.status == 401) {
        window.location.reload();
        throw new FetchError('Reloader siden på grunn av HTTP-kode 401 fra backend.');
    }

    if (!response.ok) {
        const defaultErrorHandler = () => {
            throw new FetchError(
                `Kall til url: ${options.method || 'GET'} ${url} og x_request_id: ${requestId} feilet med HTTP-kode: ${
                    response.status
                }.`,
            );
        };
        if (errorHandler) {
            errorHandler(response, requestId, defaultErrorHandler);
        } else {
            defaultErrorHandler();
        }
    }

    return { requestId, response };
};
