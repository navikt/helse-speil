import dayjs from 'dayjs';

import { ApiPerson, ApiPersonKjønn } from '@io/rest/generated/spesialist.schemas';
import { fetchPersondata } from '@spesialist-mock/graphql';
import { Kjonn } from '@spesialist-mock/schemaTypes';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const identitetsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!identitetsnummer) return Response.error();
    const person = fetchPersondata()[identitetsnummer];
    if (!person) return Response.error();

    const apiPerson: ApiPerson = {
        identitetsnummer: person.fodselsnummer,
        andreIdentitetsnumre: person.andreFodselsnummer.map((it) => it.fodselsnummer),
        aktørId: person.aktorId,
        fornavn: toApiPersonFornavn(person.personinfo.fornavn, person.personinfo.mellomnavn),
        etternavn: person.personinfo.etternavn,
        kjønn: toApiPersonKjønn(person.personinfo.kjonn),
        alder: dayjs().diff(person.personinfo.fodselsdato, 'year'),
        boenhet: {
            enhetNr: person.enhet.id,
        },
    };
    return Response.json(apiPerson, { status: 200 });
};

function toApiPersonFornavn(fornavn: string, mellomnavn: string | null | undefined) {
    if (mellomnavn !== null && mellomnavn !== undefined) {
        return fornavn + ' ' + mellomnavn;
    }
    return fornavn;
}

function toApiPersonKjønn(kjønn: Kjonn): ApiPersonKjønn {
    switch (kjønn) {
        case Kjonn.Kvinne:
            return ApiPersonKjønn.KVINNE;
        case Kjonn.Mann:
            return ApiPersonKjønn.MANN;
        case Kjonn.Ukjent:
            return ApiPersonKjønn.UKJENT;
    }
}
