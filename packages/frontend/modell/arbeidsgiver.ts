import { usePerson } from '../state/person';
import { useMaybeAktivPeriode } from '../state/tidslinje';

export const useArbeidsforhold = (organisasjonsnummer: string): ExternalArbeidsforhold[] =>
    usePerson()?.arbeidsforhold.filter((it) => it.organisasjonsnummer === organisasjonsnummer) ?? [];

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
