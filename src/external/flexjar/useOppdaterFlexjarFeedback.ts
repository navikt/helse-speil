import { postJson } from '@app/fetch/fetchClient';
import { useMutation } from '@tanstack/react-query';
import { FeedbackPayload } from '@typer/flexjar';

type OppdaterFeedbackVariables = { id: string; payload: FeedbackPayload };

export const useOppdaterFlexjarFeedback = () =>
    useMutation({
        mutationFn: async (variables: OppdaterFeedbackVariables): Promise<unknown> =>
            postJson(`/api/flexjar/oppdater/${variables.id}`, variables.payload),
    });
