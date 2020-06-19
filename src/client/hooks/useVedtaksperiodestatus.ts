import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Periodetype } from '../context/types.internal';
import dayjs from 'dayjs';

export enum VedtaksperiodeStatus {
    Førstegangs = 'ubehandlet',
    Påfølgende = 'påfølgende',
    PåfølgendeInfotrygd = 'påfølgendeInfotrygd',
    Behandlet = 'behandlet',
}

export const useVedtaksperiodestatus = (): VedtaksperiodeStatus | undefined => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    if (!aktivVedtaksperiode) return undefined;

    const erGodkjent =
        aktivVedtaksperiode.rawData.godkjentAv !== null && aktivVedtaksperiode.rawData.godkjentAv !== undefined;
    const førsteUtbetalingsdag = aktivVedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling?.linjer[0].fom ?? dayjs(0);

    const erFørstegangsbehandling =
        !erGodkjent &&
        aktivVedtaksperiode.utbetalingstidslinje.some((enUtbetalingsdag) =>
            enUtbetalingsdag.dato.isSame(førsteUtbetalingsdag)
        );

    const periodetype = aktivVedtaksperiode.periodetype;
    if (periodetype) {
        if (erGodkjent) {
            return VedtaksperiodeStatus.Behandlet;
        } else if (periodetype === Periodetype.Førstegangsbehandling) {
            return VedtaksperiodeStatus.Førstegangs;
        } else return VedtaksperiodeStatus.Påfølgende;
    }

    if (erGodkjent) {
        return VedtaksperiodeStatus.Behandlet;
    } else if (erFørstegangsbehandling) {
        return VedtaksperiodeStatus.Førstegangs;
    } else {
        return VedtaksperiodeStatus.Påfølgende;
    }
};
