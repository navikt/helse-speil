import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { usePerson } from './person';
import { Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

const defaultPeriode = (person: Person): Vedtaksperiode | undefined => {
    const velgbarePerioder = person.arbeidsgivere
        .flatMap((arb) => arb.vedtaksperioder)
        .filter((periode) => periode.kanVelges)
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (velgbarePerioder?.find((periode) => periode.tilstand === Vedtaksperiodetilstand.Oppgaver) ??
        velgbarePerioder?.[0]) as Vedtaksperiode;
};

export const useAktivPeriode = () => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);

    if (person && periodeId) {
        const utbetalingshistorikk = person.arbeidsgivere
            .flatMap((a) => a.utbetalingshistorikk)
            .flatMap((a) => a.perioder)
            .find((p) => p.id === periodeId);
        const vedtaksperiode = person.arbeidsgivere.flatMap((a) => a.vedtaksperioder).find((p) => p.id === periodeId);

        return vedtaksperiode ?? utbetalingshistorikk;
    }
    if (person) {
        return defaultPeriode(person);
    } else return undefined;
};

export const useAktivVedtaksperiode = () => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);

    if (person && periodeId) {
        return person.arbeidsgivere.flatMap((a) => a.vedtaksperioder).find((p) => p.id === periodeId) as Vedtaksperiode;
    }
    if (person) {
        return defaultPeriode(person);
    } else return undefined;
};
