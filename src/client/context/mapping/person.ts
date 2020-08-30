import { PersoninfoFraSparkel } from '../../../types';
import { somDato } from './vedtaksperiode';
import { Kjønn, Person, Personinfo } from '../types.internal';
import { SpesialistPerson } from './types.external';
import { tilInfotrygdutbetalinger } from './infotrygd';
import { tilArbeidsgivere } from './arbeidsgiver';

const tilPersoninfo = (person: SpesialistPerson, info?: PersoninfoFraSparkel): Personinfo => ({
    fornavn: person.personinfo.fornavn,
    mellomnavn: person.personinfo.mellomnavn,
    etternavn: person.personinfo.etternavn,
    fødselsdato: somDato(info?.fødselsdato ?? person.personinfo.fødselsdato!),
    kjønn: (info?.kjønn ?? person.personinfo.kjønn) as Kjønn,
    fnr: info?.fnr ?? person.fødselsnummer,
});

const tilPersonMedInfo = async (person: SpesialistPerson, personinfo: Personinfo): Promise<Person> => ({
    aktørId: person.aktørId,
    fødselsnummer: person.fødselsnummer,
    arbeidsgivere: await tilArbeidsgivere(person),
    personinfo,
    infotrygdutbetalinger: tilInfotrygdutbetalinger(person),
    enhet: person.enhet,
    tildeltTil: person.tildeltTil ?? undefined,
});

// Optional personinfo fra Sparkel kan fjernes når vi ikke lenger
// kan komme til å hente person fra Spesialist som mangler kjønn
// (og fødselsdato, som vi ikke bruker ennå)
export const tilPerson = (person: SpesialistPerson, personinfoFraSparkel?: PersoninfoFraSparkel): Promise<Person> => {
    const personinfo = tilPersoninfo(person, personinfoFraSparkel);
    return tilPersonMedInfo(person, personinfo);
};
