import { Opptegnelsetype } from '@io/graphql';
import { opptegnelser } from '@spesialist-mock/data/opptegnelser';
import { finnAktørId } from '@spesialist-mock/graphql';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;

    setTimeout(() => {
        opptegnelser.push({
            aktorId: finnAktørId(pseudoId)!,
            sekvensnummer: Math.max(...opptegnelser.map((it) => it.sekvensnummer)) + 1,
            type: Opptegnelsetype.NySaksbehandleroppgave,
            payload: 'Mock-payload',
            __typename: 'Opptegnelse',
        });
    }, 2000);

    return new Response(null, { status: 204 });
};
