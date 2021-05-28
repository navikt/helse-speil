import { Person, UfullstendigVedtaksperiode, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { usePerson } from './person';
import { Utbetalingstatus } from '../modell/UtbetalingshistorikkElement';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

const defaultPeriode = (person: Person): Vedtaksperiode | undefined => {
    const velgbarePerioder = person.arbeidsgivere
        .flatMap((arb) => arb.vedtaksperioder)
        .filter((periode) => periode.fullstendig)
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (velgbarePerioder?.find((periode) => periode.tilstand === Vedtaksperiodetilstand.Oppgaver) ??
        velgbarePerioder?.[0]) as Vedtaksperiode;
};

const defaultTidslinjeperiode = (person: Person) => {
    const velgbarePerioder = person.arbeidsgivere
        .flatMap((arb) => arb.tidslinjeperioder)
        .flatMap((perioder) => perioder)
        .filter((periode) => periode.fullstendig)
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (
        velgbarePerioder?.find((periode) => periode.tilstand === Utbetalingstatus.IKKE_UTBETALT) ??
        velgbarePerioder?.[0]
    );
};

export const useOppgavereferanse = (beregningId: string): string => {
    const person = usePerson();
    const vedtaksperiode = person?.arbeidsgivere
        .flatMap((a) => a.vedtaksperioder)
        .find((p) => p.beregningIder?.includes(beregningId)) as Vedtaksperiode;
    return vedtaksperiode.oppgavereferanse!;
};

export const decomposedId = (periodeId: String) => {
    const res = periodeId.split('+');
    return {
        id: res[0],
        beregningId: res[1],
        unique: res[2],
    };
};

export const useAktivPeriode = () => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);

    if (person && periodeId) {
        const { id, beregningId, unique } = decomposedId(periodeId);

        return person.arbeidsgivere
            .flatMap((a) => a.tidslinjeperioder)
            .flatMap((perioder) => perioder)
            .find((periode) => periode.id === id && periode.beregningId === beregningId && periode.unique === unique);
    }
    if (person) {
        return defaultTidslinjeperiode(person);
    } else return undefined;
};

export const useVedtaksperiode = (vedtaksperiodeId: string) =>
    usePerson()
        ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
        .find((p) => p.id === vedtaksperiodeId) as Vedtaksperiode;

export const useUfullstendigVedtaksperiode = (vedtaksperiodeId: string) =>
    usePerson()
        ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
        .find((p) => p.id === vedtaksperiodeId) as UfullstendigVedtaksperiode;

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
