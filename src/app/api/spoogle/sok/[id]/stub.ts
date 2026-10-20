import { NextRequest } from 'next/server';

import { SpoogleNode, SpoogleSøkResponse } from '@io/rest/spoogle';
import { lesTestpersonfiler } from '@spesialist-mock/storage/person';

export async function stub(_request: NextRequest, params: Promise<{ id: string }>) {
    const { id } = await params;

    for (const { data } of lesTestpersonfiler()) {
        const { fodselsnummer, arbeidsgivere } = data.person;
        for (const arbeidsgiver of arbeidsgivere) {
            const finnesPåArbeidsgiver = arbeidsgiver.behandlinger
                .flatMap((behandling) => behandling.perioder)
                .some((periode) => periode.vedtaksperiodeId === id);
            if (!finnesPåArbeidsgiver) continue;

            const vedtaksperiode: SpoogleNode = { id, type: 'VEDTAKSPERIODE_ID', children: [], ugyldig_fra: null };
            const organisasjon: SpoogleNode = {
                id: arbeidsgiver.organisasjonsnummer,
                type: 'ORGANISASJONSNUMMER',
                children: [vedtaksperiode],
                ugyldig_fra: null,
            };
            const person: SpoogleNode = {
                id: fodselsnummer,
                type: 'FØDSELSNUMMER',
                children: [organisasjon],
                ugyldig_fra: null,
            };
            return Response.json({
                tree: person,
                path: [fodselsnummer, arbeidsgiver.organisasjonsnummer, id],
            } satisfies SpoogleSøkResponse);
        }
    }

    return new Response(null, { status: 404 });
}
