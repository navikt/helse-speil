import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';

export enum VedtaksperiodeStatus {
    Ubehandlet = 'ubehandlet',
    Påfølgende = 'påfølgende',
    Behandlet = 'behandlet'
}

export const useVedtaksperiodestatus = (): VedtaksperiodeStatus | undefined => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return undefined;

    const erFørstePeriode =
        aktivVedtaksperiode.rawData.førsteFraværsdag ===
        aktivVedtaksperiode.sykdomstidslinje[0].dagen;
    const erGodkjent =
        aktivVedtaksperiode.rawData.godkjentAv !== null &&
        aktivVedtaksperiode.rawData.godkjentAv !== undefined;

    if (erGodkjent) {
        return VedtaksperiodeStatus.Behandlet;
    } else if (erFørstePeriode) {
        return VedtaksperiodeStatus.Ubehandlet;
    } else {
        return VedtaksperiodeStatus.Påfølgende;
    }
};
