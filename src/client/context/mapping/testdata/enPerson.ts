import { enArbeidsgiver } from './enArbeidsgiver';

export const enPerson = (arbeidsgivere = [enArbeidsgiver()]) => ({
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    navn: { fornavn: 'Kringle', mellomnavn: null, etternavn: 'Krangel' },
    arbeidsgivere: arbeidsgivere,
});
