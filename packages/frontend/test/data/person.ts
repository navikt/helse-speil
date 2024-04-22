import { Adressebeskyttelse, Arbeidsgiver, Kjonn, Person } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';

type Extensions = {
    medArbeidsgivere(arbeidsgivere: Array<Arbeidsgiver>): Person;
};

export const enPerson: OverridableConstructor<Person, Extensions> = (overrides) => ({
    aktorId: '1234567890',
    fodselsnummer: '12345678910',
    arbeidsgivere: [enArbeidsgiver()],
    personinfo: {
        fornavn: 'Navn',
        etternavn: 'Navnesen',
        kjonn: Kjonn.Kvinne,
        adressebeskyttelse: Adressebeskyttelse.Ugradert,
        unntattFraAutomatisering: {
            erUntatt: false,
            arsaker: [],
            tidspunkt: null,
        },
    },
    enhet: {
        id: '1234',
        navn: 'Oslo',
    },
    versjon: 1,
    vilkarsgrunnlag: [],
    ...overrides,
    medArbeidsgivere(arbeidsgivere: Array<Arbeidsgiver>): Person {
        this.arbeidsgivere = arbeidsgivere;
        return this;
    },
});
