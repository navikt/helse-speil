import { postJson } from '@app/fetch/fetchClient';
import { useMutation } from '@tanstack/react-query';
import { FeedbackPayload } from '@typer/flexjar';

type OpprettFeedbackResponse = {
    id: string;
};

export const useOpprettFlexjarFeedback = () =>
    useMutation({
        mutationFn: async (payload: FeedbackPayload): Promise<OpprettFeedbackResponse> =>
            postJson(`/api/flexjar`, payload),
    });
