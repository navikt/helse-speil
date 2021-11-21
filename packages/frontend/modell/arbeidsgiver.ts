import { usePerson } from '../state/person';
import { useMaybeAktivPeriode } from '../state/tidslinje';

export const useArbeidsforhold = (organisasjonsnummer: string): Arbeidsforhold[] | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === organisasjonsnummer)?.arbeidsforhold;

export const useMaybeArbeidsgiver = (): Arbeidsgiver | undefined => {
    const aktivPeriode = useMaybeAktivPeriode();
    const person = usePerson();

    return (
        aktivPeriode &&
        person?.arbeidsgivere.find(
            ({ organisasjonsnummer }) => organisasjonsnummer === aktivPeriode?.organisasjonsnummer
        )
    );
};

export const useArbeidsgiver = (): Arbeidsgiver => {
    const arbeidsgiver = useMaybeArbeidsgiver();

    if (!arbeidsgiver) throw Error('Forventet å finne arbeidsgiver');

    return arbeidsgiver;
};
