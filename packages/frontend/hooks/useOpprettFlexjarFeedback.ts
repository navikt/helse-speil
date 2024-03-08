import { ErrorHandler, fetchMedRequestId } from '@hooks/useOppdaterFlexjarFeedback';
import { FetchError } from '@io/graphql/errors';
import { useMutation } from '@tanstack/react-query';

const basePath = 'https://flexjar-backend.flex';

export function UseOpprettFlexjarFeedback() {
    return useMutation<OpprettFeedbackResoponse, unknown, object>({
        mutationKey: ['opprettFlexjarFeedback'],
        mutationFn: async (body) => {
            return fetchJsonMedRequestId(`${basePath}/api/flexjar-backend/api/v2/feedback`, {
                method: 'POST',
                body: JSON.stringify(body),

                headers: {
                    'Content-Type': 'application/json',
                },
            });
        },
    });
}

interface OpprettFeedbackResoponse {
    id: string;
}

export const fetchJsonMedRequestId = async (url: string, options: RequestInit = {}, errorHandler?: ErrorHandler) => {
    const fetchResult = await fetchMedRequestId(url, options, errorHandler);
    const response = fetchResult.response;

    // Guard som sjekker at response faktisk er OK før vi prøver å parse JSON siden default throw i fetchMedRequestId()
    // kan bli utelatt i en custom errorHandler.
    if (!response.ok) {
        throw new Error(
            `Response er ${response.status}, så vi parser ikke JSON for url: ${
                options.method || 'GET'
            } ${url} og x_request_id: ${fetchResult.requestId}.`,
        );
    }

    try {
        return await response.json();
    } catch (e) {
        throw new FetchError(
            `${e} - Kall til url: ${options.method || 'GET'} ${url} og x_request_id: ${
                fetchResult.requestId
            } feilet ved parsing av JSON med HTTP-kode: ${response.status}.`,
        );
    }
};
