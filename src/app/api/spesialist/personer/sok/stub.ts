import { fetchPersondata } from '@spesialist-mock/graphql';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request) => {
    const { aktørId, identitetsnummer } = await _request.json();

    if (aktørId === '10000000002')
        return Response.json({ personPseudoId: '64b51f30-2f3f-4872-afb9-8f7f31ab6c36', klarForVisning: false });
    if (aktørId === '10000000003')
        return Response.json({ personPseudoId: 'b99b7845-f892-484c-b1d8-e070d2821bb6', klarForVisning: true });

    const person = fetchPersondata()[identitetsnummer ?? aktørId ?? ''];

    const personPseudoId = PersonMock.findPersonPseudoId(identitetsnummer ?? aktørId ?? '');

    if (personPseudoId == undefined)
        return Response.json(
            {
                type: 'about:blank',
                status: 404,
                title: 'Person ikke funnet',
                code: 'PERSON_IKKE_FUNNET',
            },
            { status: 404 },
        );

    return Response.json({ personPseudoId: personPseudoId, klarForVisning: person?.personinfo != null });
};
