import { FetchError } from '@io/graphql/errors';
import { useMutation } from '@tanstack/react-query';

export function useOppdaterFlexjarFeedback() {
    return useMutation<unknown, Error, OppdaterFlexjarFeedbackRequest>({
        mutationFn: async (req) => {
            return fetchFlexjar(`/api/flexjar/oppdater/${req.id}`, {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
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

export type FetchResult = { response: Response };
export type ErrorHandler = (result: Response, defaultErrorHandler: () => void) => void;
export const fetchFlexjar = async (
    url: string,
    options: RequestInit = {},
    errorHandler?: ErrorHandler,
): Promise<FetchResult> => {
    const fetchUrl = async () => {
        try {
            return await fetch(url, options);
        } catch (e) {
            throw new FetchError(`${e} - Kall til url: ${options.method} ${url} - feilet uten svar fra backend.`);
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
                `Kall til url: ${options.method || 'GET'} ${url} - feilet med HTTP-kode: ${response.status}.`,
            );
        };
        if (errorHandler) {
            errorHandler(response, defaultErrorHandler);
        } else {
            defaultErrorHandler();
        }
    }

    return { response };
};
