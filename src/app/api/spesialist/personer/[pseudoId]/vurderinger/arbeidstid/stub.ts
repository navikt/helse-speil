import { Opptegnelsetype } from '@io/graphql';
import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { opptegnelser } from '@spesialist-mock/data/opptegnelser';
import { finnAktørId, finnFødselsnummer } from '@spesialist-mock/graphql';
import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

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
        OpptegnelseMock.pushOpptegnelse(finnFødselsnummer(pseudoId)!, ApiOpptegnelseType.NY_SAKSBEHANDLEROPPGAVE);
    }, 2000);

    return new Response(null, { status: 204 });
};
