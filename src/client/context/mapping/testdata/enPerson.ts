import { enArbeidsgiver } from './enArbeidsgiver';

export const enPerson = (arbeidsgivere = [enArbeidsgiver()]) => ({
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    personinfo: { fornavn: 'Kringle', mellomnavn: null, etternavn: 'Krangel', fødselsdato: null, kjønn: null },
    arbeidsgivere: arbeidsgivere,
    enhet: { id: '', navn: '' },
    tildeltTil: null,
});
