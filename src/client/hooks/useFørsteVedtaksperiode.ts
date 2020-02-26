import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Vedtaksperiode } from '../context/types';

interface UseFørsteVedtaksperiodeOptions {
    nåværendePeriode?: Vedtaksperiode;
}

/**
 * Finner første vedtaksperiode i en serie av sammenhengende vedtaksperioder
 */
export const useFørsteVedtaksperiode = ({
    nåværendePeriode
}: UseFørsteVedtaksperiodeOptions): Vedtaksperiode | undefined => {
    const { personTilBehandling } = useContext(PersonContext);

    return personTilBehandling?.arbeidsgivere
        .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
        .find(
            periode =>
                periode.utbetalingsreferanse === nåværendePeriode?.utbetalingsreferanse &&
                periode.sykdomstidslinje[0].dagen ===
                    nåværendePeriode.inngangsvilkår.dagerIgjen.førsteFraværsdag
        );
};
