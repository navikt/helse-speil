import {
    ApiArbeidsgiver,
    ApiSaksbildePerson,
    ApiTilleggsinfoForInntektskilde,
} from '@io/rest/generated/spesialist.schemas';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { OverridableConstructor } from '@typer/shared';

type Extensions = {
    medArbeidsgivere(arbeidsgivere: ApiArbeidsgiver[]): ApiSaksbildePerson & Extensions;
    medTilleggsinfoForInntektskilder(
        tilleggsinfoForInntektskilder: ApiTilleggsinfoForInntektskilde[],
    ): ApiSaksbildePerson & Extensions;
};

export const enPerson: OverridableConstructor<ApiSaksbildePerson, Extensions> = (overrides) => {
    return {
        aktorId: '1234567890',
        personPseudoId: 'f4fa2a9d-c41f-4ec0-85ca-4550dcab0321',
        andreFodselsnummer: [],
        fodselsnummer: '12345678910',
        dodsdato: null,
        arbeidsgivere: [enArbeidsgiver()],
        selvstendigNaering: null,
        vilkarsgrunnlagV2: [],
        tilleggsinfoForInntektskilder: [tilleggsinfoFraEnInntektskilde()],
        ...overrides,
        medArbeidsgivere(arbeidsgivere: ApiArbeidsgiver[]): ApiSaksbildePerson & Extensions {
            this.arbeidsgivere = arbeidsgivere;
            return this;
        },
        medTilleggsinfoForInntektskilder(
            tilleggsinfoForInntektskilder: ApiTilleggsinfoForInntektskilde[],
        ): ApiSaksbildePerson & Extensions {
            this.tilleggsinfoForInntektskilder = tilleggsinfoForInntektskilder;
            return this;
        },
    };
};
