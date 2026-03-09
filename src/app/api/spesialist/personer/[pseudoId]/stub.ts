import dayjs from 'dayjs';

import { ApiPerson, ApiPersonAdressebeskyttelse, ApiPersonKjønn } from '@io/rest/generated/spesialist.schemas';
import { fetchPersondata } from '@spesialist-mock/graphql';
import { Adressebeskyttelse, Kjonn } from '@spesialist-mock/schemaTypes';
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
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
        fødselsdato: person.personinfo.fodselsdato ?? dayjs().format('YYYY-MM-DD'),
        dødsdato: person.dodsdato,
        kjønn: toApiPersonKjønn(person.personinfo.kjonn),
        adressebeskyttelse: toApiPersonAdressebeskyttelse(person.personinfo.adressebeskyttelse),
    };
    return Response.json(apiPerson, { status: 200 });
};

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

function toApiPersonAdressebeskyttelse(adressebeskyttelse: Adressebeskyttelse): ApiPersonAdressebeskyttelse {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.Fortrolig:
            return ApiPersonAdressebeskyttelse.FORTROLIG;
        case Adressebeskyttelse.StrengtFortrolig:
            return ApiPersonAdressebeskyttelse.STRENGT_FORTROLIG;
        case Adressebeskyttelse.StrengtFortroligUtland:
            return ApiPersonAdressebeskyttelse.STRENGT_FORTROLIG_UTLAND;
        case Adressebeskyttelse.Ugradert:
            return ApiPersonAdressebeskyttelse.UGRADERT;
        case Adressebeskyttelse.Ukjent:
            return ApiPersonAdressebeskyttelse.UKJENT;
    }
}

