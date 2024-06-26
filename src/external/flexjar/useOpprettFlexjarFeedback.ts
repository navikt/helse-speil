import { gql, useMutation } from '@apollo/client';
import { FeedbackPayload } from '@typer/flexjar';

type OpprettFeedbackResponse = {
    opprettFlexjarFeedback: {
        id: string;
    };
};

export function useOpprettFlexjarFeedback() {
    const [mutate, { data, error, reset }] = useMutation<OpprettFeedbackResponse, { payload: FeedbackPayload }>(gql`
        mutation OpprettFlexjarFeedback($payload: JSON!) {
            opprettFlexjarFeedback(input: $payload)
                @rest(type: "FlexjarFeedback", endpoint: "flexjar", path: "", method: "POST", bodyKey: "input") {
                id
            }
        }
    `);

    return {
        mutate,
        data: data ? data.opprettFlexjarFeedback : null,
        error,
        reset,
    };
}
