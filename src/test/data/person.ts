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
    medArbeidsgivere(arbeidsgivere: ArbeidsgiverFragment[]): PersonFragment & Extensions;
    medTilleggsinfoForInntektskilder(
        tilleggsinfoForInntektskilder: TilleggsinfoForInntektskilde[],
    ): PersonFragment & Extensions;
};

export const enPerson: OverridableConstructor<PersonFragment, Extensions> = (overrides) => {
    return {
        __typename: 'Person',
        aktorId: '1234567890',
        personPseudoId: 'f4fa2a9d-c41f-4ec0-85ca-4550dcab0321',
        fodselsnummer: '12345678910',
        dodsdato: null,
        infotrygdutbetalinger: null,
        tildeling: null,
        arbeidsgivere: [enArbeidsgiver()],
        selvstendigNaering: null,
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
            fodselsdato: '1986-02-06',
            reservasjon: null,
            automatiskBehandlingStansetAvSaksbehandler: false,
        },
        enhet: {
            __typename: 'Enhet',
            id: '1234',
            navn: 'Oslo',
        },
        versjon: 1,
        vilkarsgrunnlag: [],
        vilkarsgrunnlagV2: [],
        tilleggsinfoForInntektskilder: [tilleggsinfoFraEnInntektskilde()],
        ...overrides,
        medArbeidsgivere(arbeidsgivere: ArbeidsgiverFragment[]): PersonFragment & Extensions {
            this.arbeidsgivere = arbeidsgivere;
            return this;
        },
        medTilleggsinfoForInntektskilder(
            tilleggsinfoForInntektskilder: TilleggsinfoForInntektskilde[],
        ): PersonFragment & Extensions {
            this.tilleggsinfoForInntektskilder = tilleggsinfoForInntektskilder;
            return this;
        },
    };
};
