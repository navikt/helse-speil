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

export const mappetPerson = async (
    arbeidsgivere = [umappetArbeidsgiver()],
    personinfoFraSparkel?: PersoninfoFraSparkel
) => {
    const { person } = await mapPerson(umappetPerson(arbeidsgivere), personinfoFraSparkel);
    return person;
};

export const personinfoFraSparkel = ({ kjønn = 'Mannebjørn', fødselsdato = '1956-12-12', fnr = '01019000123' }) => ({
    kjønn,
    fødselsdato,
    fnr,
});
