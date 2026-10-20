import { type HttpError, getJson } from '@app/fetch/fetchClient';
import { useMutation } from '@tanstack/react-query';

export type SpoogleNode = {
    id: string;
    type: string;
    children: SpoogleNode[];
    ugyldig_fra: string | null;
};

export type SpoogleSøkResponse = {
    tree: SpoogleNode;
    path: string[];
};

const finnFødselsnummerForVedtaksperiode = async (vedtaksperiodeId: string): Promise<string> => {
    // Spoogle svarer med text/plain selv om innholdet er JSON
    const svar = await getJson<SpoogleSøkResponse | string>(`/api/spoogle/sok/${encodeURIComponent(vedtaksperiodeId)}`);
    const { tree }: SpoogleSøkResponse = typeof svar === 'string' ? JSON.parse(svar) : svar;
    if (tree.type !== 'FØDSELSNUMMER') {
        const error: HttpError = new Error('Fant ikke fødselsnummer for vedtaksperioden');
        error.status = 404;
        throw error;
    }
    return tree.id;
};

export const useFinnFødselsnummerForVedtaksperiode = () =>
    useMutation<string, HttpError, string>({
        mutationKey: ['finnFødselsnummerForVedtaksperiode'],
        mutationFn: finnFødselsnummerForVedtaksperiode,
    });
