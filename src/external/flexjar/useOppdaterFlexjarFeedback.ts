import { AxiosResponse } from 'axios';

import { customAxios } from '@app/axios/axiosClient';
import { useMutation } from '@tanstack/react-query';
import { FeedbackPayload } from '@typer/flexjar';

type OppdaterFeedbackVariables = { id: string; payload: FeedbackPayload };

export const useOppdaterFlexjarFeedback = () =>
    useMutation({
        mutationFn: async (variables: OppdaterFeedbackVariables): Promise<AxiosResponse<unknown>> =>
            customAxios.post(`/api/flexjar/oppdater/${variables.id}`, variables.payload),
    });
