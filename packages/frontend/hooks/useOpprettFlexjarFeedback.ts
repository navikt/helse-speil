import { ErrorHandler, fetchFlexjar } from '@hooks/useOppdaterFlexjarFeedback';
import { FetchError } from '@io/graphql/errors';
import { useMutation } from '@tanstack/react-query';
import { erLocal } from '@utils/featureToggles';

export function useOpprettFlexjarFeedback() {
    return useMutation<OpprettFeedbackResoponse, unknown, object>({
        mutationKey: ['opprettFlexjarFeedback'],
        mutationFn: async (body) => {
            return fetchJsonFlexjar(`${erLocal() ? 'http://localhost:3000' : ''}/flexjar`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
        },
    });
}

interface OpprettFeedbackResoponse {
    id: string;
}

export const fetchJsonFlexjar = async (url: string, options: RequestInit = {}, errorHandler?: ErrorHandler) => {
    const fetchResult = await fetchFlexjar(url, options, errorHandler);
    const response = fetchResult.response;

    console.log('response flexjar', response);

    // Guard som sjekker at response faktisk er OK før vi prøver å parse JSON siden default throw i fetchMedRequestId()
    // kan bli utelatt i en custom errorHandler.
    if (!response.ok) {
        throw new Error(
            `Response er ${response.status}, så vi parser ikke JSON for url: ${options.method || 'GET'} ${url}.`,
        );
    }

    try {
        return await response.json();
    } catch (e) {
        throw new FetchError(
            `${e} - Kall til url: ${options.method || 'GET'} ${url} feilet ved parsing av JSON med HTTP-kode: ${
                response.status
            }.`,
        );
    }
};
