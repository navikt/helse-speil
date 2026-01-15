import { fetchPersondata } from '@spesialist-mock/graphql';

export const stub = async (_request: Request) => {
    const { aktørId, identitetsnummer } = await _request.json();

    if (aktørId === '10000000002')
        return Response.json({ personPseudoId: '64b51f30-2f3f-4872-afb9-8f7f31ab6c36', klarForVisning: false });

    const person = fetchPersondata()[identitetsnummer ?? aktørId ?? ''];

    const personPseudoId = person?.personPseudoId;
    if (personPseudoId == undefined) return Response.json({ status: 404 });
    const klarForVisning = person?.personinfo != null;
    return Response.json({ personPseudoId: personPseudoId, klarForVisning: klarForVisning });
};
