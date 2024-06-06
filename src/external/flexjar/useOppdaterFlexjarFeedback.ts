import { FeedbackPayload } from '@/external/flexjar/types';
import { gql, useMutation } from '@apollo/client';

type OppdaterFeedbackVariables = { id: string; payload: FeedbackPayload };

export function useOppdaterFlexjarFeedback() {
    const [mutate, { data, error }] = useMutation<unknown, OppdaterFeedbackVariables>(gql`
        mutation OppdaterFlexjarFeedback($id: String!, $payload: JSON!) {
            oppdaterFlexjarFeedback(id: $id, input: $payload)
                @rest(
                    type: "FlexjarFeedback"
                    endpoint: "flexjar"
                    path: "/oppdater/{args.id}"
                    method: "POST"
                    bodyKey: "input"
                ) {
                id
            }
        }
    `);

    return {
        mutate,
        data,
        error,
    };
}
