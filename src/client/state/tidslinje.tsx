import { Person, Tidslinjetilstand, Vedtaksperiode } from 'internal-types';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { Tidslinjeperiode } from '../modell/utbetalingshistorikkelement';

import { usePerson } from './person';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

export const useAktivPeriode = (): Tidslinjeperiode | undefined => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivPeriodeState);

    if (person && periodeId) {
        const { id, beregningId, unique } = decomposedId(periodeId);

        return (
            person.arbeidsgivere
                .flatMap((a) => a.tidslinjeperioder)
                .flatMap((perioder) => perioder)
                .find(
                    (periode) => periode.id === id && periode.beregningId === beregningId && periode.unique === unique
                ) ?? defaultTidslinjeperiode(person)
        );
    }
    if (person) {
        return defaultTidslinjeperiode(person);
    } else return undefined;
};

export const useVedtaksperiode = (vedtaksperiodeId?: string): Vedtaksperiode | undefined =>
    usePerson()
        ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
        .find((p) => p.id === vedtaksperiodeId) as Vedtaksperiode | undefined;

export const useOppgavereferanse = (beregningId: string): string | undefined => {
    const person = usePerson();
    const vedtaksperiode = person?.arbeidsgivere
        .flatMap((a) => a.vedtaksperioder)
        .find((p) => p.beregningIder?.includes(beregningId)) as Vedtaksperiode | undefined;
    return vedtaksperiode?.oppgavereferanse;
};

export const harOppgave = (tidslinjeperiode: Tidslinjeperiode) =>
    [Tidslinjetilstand.Oppgaver, Tidslinjetilstand.Revurderes].includes(tidslinjeperiode.tilstand);

const defaultTidslinjeperiode = (person: Person): Tidslinjeperiode | undefined => {
    const valgbarePerioder: Tidslinjeperiode[] = person.arbeidsgivere
        .flatMap((arb) => arb.tidslinjeperioder)
        .flatMap((perioder) => perioder)
        .filter((periode) => periode.fullstendig)
        .sort((a, b) => (a.opprettet.isAfter(b.opprettet) ? 1 : -1))
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (
        valgbarePerioder.find((periode) =>
            [Tidslinjetilstand.Oppgaver, Tidslinjetilstand.Revurderes].includes(periode.tilstand)
        ) ?? valgbarePerioder[0]
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
