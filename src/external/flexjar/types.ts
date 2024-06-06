export type FeedbackPayload = Record<string, unknown> & {
    feedback: string;
    svar: string | number;
    feedbackId: string;
};
