import { usePerson } from '../state/person';
import { useMaybeAktivPeriode } from '../state/tidslinje';

export const useArbeidsgivernavn = (organisasjonsnummer: string): string | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === organisasjonsnummer)?.navn;

export const useArbeidsforhold = (organisasjonsnummer: string): Arbeidsforhold[] | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === organisasjonsnummer)?.arbeidsforhold;

export const useArbeidsgiver = (): Arbeidsgiver | undefined => {
    const aktivPeriode = useMaybeAktivPeriode();
    const person = usePerson();
    return (
        aktivPeriode &&
        person?.arbeidsgivere.find(
            ({ organisasjonsnummer }) => organisasjonsnummer === aktivPeriode?.organisasjonsnummer
        )
    );
};
