import { Arbeidsgiver, Person, Vedtaksperiode } from '../context/types';

export const arbeidsgiverForVedtaksperiode = (periode?: Vedtaksperiode, person?: Person): Arbeidsgiver | undefined => {
    return person?.arbeidsgivere.find(arbeidsgiveren =>
        arbeidsgiveren.vedtaksperioder.find(perioden => perioden.id === periode?.id)
    );
};
