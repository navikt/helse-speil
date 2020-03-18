import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { somDato } from '../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../utils/date';

export enum VedtaksperiodeStatus {
    Ubehandlet = 'ubehandlet',
    Påfølgende = 'påfølgende',
    Behandlet = 'behandlet'
}

export const useVedtaksperiodestatus = (): VedtaksperiodeStatus | undefined => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return undefined;

    const erFørstePeriode =
        somDato(aktivVedtaksperiode.rawData.førsteFraværsdag).format(NORSK_DATOFORMAT) ===
        aktivVedtaksperiode.sykdomstidslinje[0].dato.format(NORSK_DATOFORMAT);
    const erGodkjent =
        aktivVedtaksperiode.rawData.godkjentAv !== null && aktivVedtaksperiode.rawData.godkjentAv !== undefined;

    if (erGodkjent) {
        return VedtaksperiodeStatus.Behandlet;
    } else if (erFørstePeriode) {
        return VedtaksperiodeStatus.Ubehandlet;
    } else {
        return VedtaksperiodeStatus.Påfølgende;
    }
};
