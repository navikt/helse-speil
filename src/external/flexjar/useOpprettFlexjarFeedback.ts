import { customAxios } from '@app/axios/axiosClient';
import { useMutation } from '@tanstack/react-query';
import { FeedbackPayload } from '@typer/flexjar';

type OpprettFeedbackResponse = {
    id: string;
};

export const useOpprettFlexjarFeedback = () =>
    useMutation({
        mutationFn: async (payload: FeedbackPayload): Promise<OpprettFeedbackResponse> =>
            (await customAxios.post(`/api/flexjar`, payload)).data,
    });
