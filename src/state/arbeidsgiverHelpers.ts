import { ArbeidsgiverFragment, Maybe, PersonFragment } from '@io/graphql';

export const finnArbeidsgiver = (person: PersonFragment, organisasjonsnummer: string): Maybe<ArbeidsgiverFragment> =>
    person.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;
