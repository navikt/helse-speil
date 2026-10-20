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

const finnFødselsnummerISpoogle = async (id: string): Promise<string> => {
    // Spoogle svarer med text/plain selv om innholdet er JSON
    const svar = await getJson<SpoogleSøkResponse | string>(`/api/spoogle/sok/${encodeURIComponent(id)}`);
    const { tree }: SpoogleSøkResponse = typeof svar === 'string' ? JSON.parse(svar) : svar;
    if (tree.type !== 'FØDSELSNUMMER') {
        const error: HttpError = new Error('Fant ikke fødselsnummer for ID-en');
        error.status = 404;
        throw error;
    }
    return tree.id;
};

export const useFinnFødselsnummerISpoogle = () =>
    useMutation<string, HttpError, string>({
        mutationKey: ['finnFødselsnummerISpoogle'],
        mutationFn: finnFødselsnummerISpoogle,
    });
