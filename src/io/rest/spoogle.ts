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

export type SpoogleTreff = {
    fødselsnummer: string;
    vedtaksperiodeId?: string;
    behandlingId?: string;
};

const søkISpoogle = async (id: string): Promise<SpoogleTreff> => {
    // Spoogle svarer med text/plain selv om innholdet er JSON
    const svar = await getJson<SpoogleSøkResponse | string>(`/api/spoogle/sok/${encodeURIComponent(id)}`);
    const { tree, path }: SpoogleSøkResponse = typeof svar === 'string' ? JSON.parse(svar) : svar;
    if (tree.type !== 'FØDSELSNUMMER') {
        const error: HttpError = new Error('Fant ikke fødselsnummer for ID-en');
        error.status = 404;
        throw error;
    }
    return { fødselsnummer: tree.id, ...finnPeriodeIStien(tree, path) };
};

/**
 * Går stien fra roten til den søkte noden og plukker ut nærmeste vedtaksperiode og behandling, slik at f.eks. en
 * oppgaveId lander på behandlingen sin og en søknadId på vedtaksperioden sin.
 */
function finnPeriodeIStien(tree: SpoogleNode, path: string[]): Omit<SpoogleTreff, 'fødselsnummer'> {
    const noderIStien: SpoogleNode[] = [];
    let node: SpoogleNode | undefined = tree;
    for (const id of path.slice(1)) {
        node = node.children.find((barn) => barn.id === id);
        if (!node) break;
        noderIStien.push(node);
    }
    const vedtaksperiodeId = noderIStien.findLast((it) => it.type === 'VEDTAKSPERIODE_ID')?.id;
    if (!vedtaksperiodeId) return {};
    const behandlingId = noderIStien.findLast((it) => it.type === 'BEHANDLING_ID')?.id;
    return behandlingId ? { vedtaksperiodeId, behandlingId } : { vedtaksperiodeId };
}

export const useSøkISpoogle = () =>
    useMutation<SpoogleTreff, HttpError, string>({
        mutationKey: ['søkISpoogle'],
        mutationFn: søkISpoogle,
    });
