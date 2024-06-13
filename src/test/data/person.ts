import { Adressebeskyttelse, ArbeidsgiverFragment, Kjonn, PersonFragment } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medArbeidsgivere(arbeidsgivere: Array<ArbeidsgiverFragment>): PersonFragment;
};

export const enPerson: OverridableConstructor<PersonFragment, Extensions> = (overrides) => ({
    __typename: 'Person',
    aktorId: '1234567890',
    fodselsnummer: '12345678910',
    dodsdato: null,
    infotrygdutbetalinger: null,
    tildeling: null,
    arbeidsgivere: [enArbeidsgiver()],
    personinfo: {
        __typename: 'Personinfo',
        fornavn: 'Navn',
        mellomnavn: null,
        etternavn: 'Navnesen',
        kjonn: Kjonn.Kvinne,
        adressebeskyttelse: Adressebeskyttelse.Ugradert,
        unntattFraAutomatisering: {
            __typename: 'UnntattFraAutomatiskGodkjenning',
            erUnntatt: false,
            arsaker: [],
            tidspunkt: null,
        },
        fodselsdato: null,
        reservasjon: null,
    },
    enhet: {
        __typename: 'Enhet',
        id: '1234',
        navn: 'Oslo',
    },
    versjon: 1,
    vilkarsgrunnlag: [],
    ...overrides,
    medArbeidsgivere(arbeidsgivere: Array<ArbeidsgiverFragment>): PersonFragment {
        this.arbeidsgivere = arbeidsgivere;
        return this;
    },
});
