import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { usePerson } from './person';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useAktivPeriodeId = () => useRecoilValue(aktivPeriodeState);

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

export const useMaybeAktivPeriode = (): TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær | undefined => {
    return undefined;
};

export const useMaybeAktivArbeidsgiverUtenSykdom = (): Arbeidsgiver | undefined => {
    return undefined;
};

export const useMaybePeriodeTilGodkjenning = (
    skjæringstidspunkt: string,
): TidslinjeperiodeMedSykefravær | undefined => {
    const person = usePerson();

    if (person) {
        return (
            person.arbeidsgivere
                .flatMap(({ tidslinjeperioder }) => tidslinjeperioder)
                .flatMap((perioder) => perioder)
                .find(
                    (periode) => periode.skjæringstidspunkt === skjæringstidspunkt && periode.tilstand === 'oppgaver',
                ) ?? undefined
        );
    }
    return undefined;
};

export const useAktivPeriode = (): TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær => {
    const aktivPeriode = useMaybeAktivPeriode();

    if (!aktivPeriode) {
        throw Error('Forventet aktiv periode men fant ingen');
    }

    return aktivPeriode;
};

export const useVedtaksperiode = (vedtaksperiodeId?: string): Vedtaksperiode | undefined =>
    usePerson()
        ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
        .find((p) => p.id === vedtaksperiodeId) as Vedtaksperiode | undefined;
