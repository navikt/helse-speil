import { usePerson } from '../state/person';
import { useMaybeAktivPeriode } from '../state/tidslinje';

export const useArbeidsforhold = (organisasjonsnummer: string): ExternalArbeidsforhold[] =>
    usePerson()?.arbeidsforhold.filter((it) => it.organisasjonsnummer === organisasjonsnummer) ?? [];

export const useHarDeaktiverArbeidsforholdFor = (organisasjonsnummer: string, skjæringstidspunkt: string) =>
    usePerson()
        ?.arbeidsgivere?.find((arbeidsgiver) => arbeidsgiver.organisasjonsnummer === organisasjonsnummer)
        ?.tidslinjeperioderUtenSykefravær.some(
            (periode) => periode.skjæringstidspunkt === skjæringstidspunkt && periode.deaktivert
        ) ?? false;

const arbeidsgiverErDeaktivertFor = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: string,
    organisasjonsnummer: string
) =>
    arbeidsgiver.organisasjonsnummer === organisasjonsnummer &&
    arbeidsgiver.tidslinjeperioderUtenSykefravær
        .filter((periode) => periode.skjæringstidspunkt === skjæringstidspunkt)
        .some((periode) => periode.deaktivert);

export const useArbeidsforholdErDeaktivert = (organisasjonsnummer: string): boolean => {
    const arbeidsgivere = usePerson()?.arbeidsgivere;
    const skjæringstidspunkt = useMaybeAktivPeriode()?.skjæringstidspunkt;
    if (!skjæringstidspunkt || !arbeidsgivere) return false;
    return arbeidsgivere.some((arbeidsgiver) =>
        arbeidsgiverErDeaktivertFor(arbeidsgiver, skjæringstidspunkt, organisasjonsnummer)
    );
};

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
