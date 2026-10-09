import { type HttpError } from '@app/fetch/fetchClient';
import { useMutation } from '@tanstack/react-query';

export type SpoutMeldingRequest = {
    melding: Record<string, unknown>;
    begrunnelse: string;
    slacklenke?: string;
};

export type SpoutSendtMelding =
    | { feil: string }
    | {
          id: string;
          tidspunkt: string;
          melding: Record<string, unknown>;
          metadata: Record<string, unknown>;
      };

export type SpoutMeldingResponse = {
    meldinger: SpoutSendtMelding[];
    lenker?: {
        kibana?: string;
        consoleCloudGoogle?: string;
        trace?: string;
    };
};

export const SPOUT_MINSTE_LENGDE_BEGRUNNELSE = 15;

const postSpoutMelding = async ({ melding, begrunnelse, slacklenke }: SpoutMeldingRequest) => {
    const body = new URLSearchParams({
        begrunnelse,
        json: JSON.stringify({ json: melding }),
    });
    if (slacklenke) body.set('issueLink', slacklenke);

    const response = await fetch('/api/spout/melding', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
    });
    const data: SpoutMeldingResponse | undefined = response.headers.get('content-type')?.includes('json')
        ? await response.json()
        : undefined;

    if (!response.ok || data == undefined) {
        const feilmelding = data?.meldinger.find((melding) => 'feil' in melding);
        const error: HttpError<SpoutMeldingResponse> = new Error(
            feilmelding && 'feil' in feilmelding
                ? feilmelding.feil
                : `Request failed with status code ${response.status}`,
        );
        error.info = data;
        error.status = response.status;
        throw error;
    }
    return data;
};

export const usePostSpoutMelding = () =>
    useMutation<SpoutMeldingResponse, HttpError<SpoutMeldingResponse>, SpoutMeldingRequest>({
        mutationKey: ['postSpoutMelding'],
        mutationFn: postSpoutMelding,
    });
