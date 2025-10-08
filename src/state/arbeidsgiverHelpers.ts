import { Arbeidsgiver, Maybe, PersonFragment } from '@io/graphql';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { isArbeidsgiver } from '@utils/typeguards';

export const finnArbeidsgiver = (person: PersonFragment, organisasjonsnummer: string): Maybe<Arbeidsgiver> =>
    finnAlleInntektsforhold(person)
        .filter(isArbeidsgiver)
        .find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;
