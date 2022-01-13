import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { usePerson } from './person';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

export const useMaybeAktivPeriode = (): TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær | undefined => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);

    if (person && periodeId) {
        const { id, beregningId, unique } = decomposedId(periodeId);

        return (
            person.arbeidsgivere
                .flatMap(({ tidslinjeperioder }) => tidslinjeperioder)
                .flatMap((perioder) => perioder)
                .find(
                    (periode) => periode.id === id && periode.beregningId === beregningId && periode.unique === unique
                ) ??
            person.arbeidsgivere
                .find((arbeidsgiver) =>
                    arbeidsgiver.tidslinjeperioderUtenSykefravær.some((periode) => periode.id === id)
                )
                ?.tidslinjeperioderUtenSykefravær.find((periode) => periode.id === id) ??
            defaultTidslinjeperiode(person)
        );
    }
    if (person) {
        return defaultTidslinjeperiode(person);
    } else return undefined;
};

export const useMaybeAktivArbeidsgiverUtenSykdom = (): Arbeidsgiver | undefined => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);
    if (person && periodeId) {
        const { id, beregningId, unique } = decomposedId(periodeId);

        return person.arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.tidslinjeperioderUtenSykefravær.some((periode) => periode.id === id)
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

export const useOppgavereferanse = (beregningId: string | undefined): string | undefined => {
    const person = usePerson();
    if (!beregningId) {
        return undefined;
    }
    const vedtaksperiode = person?.arbeidsgivere
        .flatMap((a) => a.vedtaksperioder)
        .find((p) => p.beregningIder?.includes(beregningId)) as Vedtaksperiode | undefined;
    return vedtaksperiode?.oppgavereferanse;
};

export const harOppgave = (tidslinjeperiode: TidslinjeperiodeMedSykefravær) =>
    ['oppgaver', 'revurderes'].includes(tidslinjeperiode.tilstand) && !!tidslinjeperiode.oppgavereferanse;

const defaultTidslinjeperiode = (person: Person): TidslinjeperiodeMedSykefravær | undefined => {
    const valgbarePerioder: TidslinjeperiodeMedSykefravær[] = person.arbeidsgivere
        .flatMap((arb) => arb.tidslinjeperioder)
        .flatMap((perioder) => perioder)
        .filter((periode) => periode.fullstendig)
        .sort((a, b) => (a.opprettet.isAfter(b.opprettet) ? 1 : -1))
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (
        valgbarePerioder.find((periode) => ['oppgaver', 'revurderes'].includes(periode.tilstand)) ?? valgbarePerioder[0]
    );
};

export const decomposedId = (periodeId: String) => {
    const res = periodeId.split('+');
    return {
        id: res[0],
        beregningId: res[1],
        unique: res[2],
    };
};
