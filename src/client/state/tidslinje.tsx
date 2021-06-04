import { Person, UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { Tidslinjetilstand } from '../mapping/arbeidsgiver';
import { Tidslinjeperiode } from '../modell/UtbetalingshistorikkElement';

import { usePerson } from './person';

export const aktivPeriodeState = atom<string | undefined>({
    key: 'aktivPeriodeState',
    default: undefined,
});

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeState);

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

export const useOppgavereferanse = (beregningId: string): string | undefined => {
    const person = usePerson();
    const vedtaksperiode = person?.arbeidsgivere
        .flatMap((a) => a.vedtaksperioder)
        .find((p) => p.beregningIder?.includes(beregningId)) as Vedtaksperiode;
    return vedtaksperiode.oppgavereferanse;
};

export const harOppgave = (tidslinjeperiode: Tidslinjeperiode) =>
    [Tidslinjetilstand.Oppgaver, Tidslinjetilstand.Revurderes].includes(tidslinjeperiode.tilstand);

const defaultTidslinjeperiode = (person: Person) => {
    const velgbarePerioder = person.arbeidsgivere
        .flatMap((arb) => arb.tidslinjeperioder)
        .flatMap((perioder) => perioder)
        .filter((periode) => periode.fullstendig)
        .sort((a, b) => (a.opprettet.isAfter(b.opprettet) ? 1 : -1))
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1));
    return (
        velgbarePerioder?.find((periode) =>
            [Tidslinjetilstand.Oppgaver, Tidslinjetilstand.Revurderes].includes(periode.tilstand)
        ) ?? velgbarePerioder?.[0]
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
