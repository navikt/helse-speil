import {
    Adressebeskyttelse,
    ArbeidsgiverFragment,
    Kjonn,
    PersonFragment,
    TilleggsinfoForInntektskilde,
} from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medArbeidsgivere(arbeidsgivere: Array<ArbeidsgiverFragment>): PersonFragment & Extensions;
    medTilleggsinfoForInntektskilder(
        tilleggsinfoForInntektskilder: Array<TilleggsinfoForInntektskilde>,
    ): PersonFragment & Extensions;
};

export const enPerson: OverridableConstructor<PersonFragment, Extensions> = (overrides) => {
    return {
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
            fullmakt: null,
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
        tilleggsinfoForInntektskilder: [tilleggsinfoFraEnInntektskilde()],
        ...overrides,
        medArbeidsgivere(arbeidsgivere: Array<ArbeidsgiverFragment>): PersonFragment & Extensions {
            this.arbeidsgivere = arbeidsgivere;
            return this;
        },
        medTilleggsinfoForInntektskilder(
            tilleggsinfoForInntektskilder: Array<TilleggsinfoForInntektskilde>,
        ): PersonFragment & Extensions {
            this.tilleggsinfoForInntektskilder = tilleggsinfoForInntektskilder;
            return this;
        },
    };
};
