import { mapPerson } from '../../client/mapping/person';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { PersoninfoFraSparkel } from '../../types';

export const umappetPerson = (arbeidsgivere = [umappetArbeidsgiver()]) => ({
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    personinfo: { fornavn: 'Kringle', mellomnavn: null, etternavn: 'Krangel', fødselsdato: null, kjønn: null },
    arbeidsgivere: arbeidsgivere,
    enhet: { id: '', navn: '' },
    tildeltTil: null,
});

export const mappetPerson = (arbeidsgivere = [umappetArbeidsgiver()], personinfoFraSparkel?: PersoninfoFraSparkel) =>
    mapPerson(umappetPerson(arbeidsgivere), personinfoFraSparkel);

export const personinfoFraSparkel = ({ kjønn = 'Mannebjørn', fødselsdato = '1956-12-12', fnr = '01019000123' }) => ({
    kjønn,
    fødselsdato,
    fnr,
});
