import { enArbeidsgiver } from './enArbeidsgiver';

export const enPerson = (arbeidsgivere = [enArbeidsgiver()]) => {
    return {
        aktørId: '1211109876233',
        fødselsnummer: '01019000123',
        arbeidsgivere: arbeidsgivere
    };
};
