import { Dayjs } from 'dayjs';
import {
    Arbeidsgiver,
    Sykdomsdag,
    Utbetalingsdag,
    UtbetalingshistorikkUtbetaling2,
    Utbetalingstype,
} from 'internal-types';

import { Tidslinjetilstand } from '../mapping/arbeidsgiver';
import { usePerson } from '../state/person';

const useHistorikkelement = (beregningId: string) => {
    return usePerson()
        ?.arbeidsgivere.flatMap((arb: Arbeidsgiver) => arb.utbetalingshistorikk)
        .find((element: UtbetalingshistorikkElement) => element.id === beregningId);
};

export interface UtbetalingshistorikkElement {
    id: string;
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetaling: UtbetalingshistorikkUtbetaling2;
    kilde: string;
    tidsstempel: Dayjs;
}

export const utbetalingshistorikkelement = (
    id: string,
    beregnettidslinje: Sykdomsdag[],
    hendelsetidslinje: Sykdomsdag[],
    utbetaling: UtbetalingshistorikkUtbetaling2,
    tidsstempel: Dayjs
): UtbetalingshistorikkElement => {
    return {
        id: id,
        beregnettidslinje: beregnettidslinje,
        hendelsetidslinje: hendelsetidslinje,
        utbetaling: utbetaling,
        kilde: utbetaling.type,
        tidsstempel: tidsstempel,
    };
};

export const useUtbetaling = (beregningId: string): UtbetalingshistorikkUtbetaling2 | undefined => {
    const element = useHistorikkelement(beregningId);
    if (!element) return undefined;
    return element.utbetaling;
};

export const useErAnnullert = (beregningId: string): boolean => {
    const fagsystemId = useUtbetaling(beregningId)?.arbeidsgiverFagsystemId!;
    const annullerteFagsystemider = useAnnulleringer()?.flatMap(
        (element) => element.utbetaling.arbeidsgiverFagsystemId
    );
    return annullerteFagsystemider?.includes(fagsystemId) ?? false;
};

export const useAnnulleringer = () =>
    usePerson()
        ?.arbeidsgivere.flatMap((arb) => arb.utbetalingshistorikk)
        .filter((element) => element.utbetaling.type === Utbetalingstype.ANNULLERING);

export const erUtbetaling = (utbetaling: UtbetalingshistorikkUtbetaling2) =>
    utbetaling.type === Utbetalingstype.UTBETALING;

export const sykdomstidslinje = (sykdomstidslinje: Sykdomsdag[], fom: Dayjs, tom: Dayjs) =>
    sykdomstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const utbetalingstidslinje = (utbetaling: UtbetalingshistorikkUtbetaling2, fom: Dayjs, tom: Dayjs) =>
    utbetaling.utbetalingstidslinje.filter(({ dato }) => fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato));

export const erRevurderingsperiode = (periode: Tidslinjeperiode) => periode.type === Periodetype.REVURDERING;

export const useMaksdato = (beregningId: string) => {
    return useUtbetaling(beregningId)?.maksdato;
};

export const useNettobeløp = (beregningId: string) => {
    return useUtbetaling(beregningId)?.nettobeløp;
};

export const useGjenståendeDager = (beregningId: string) => {
    return useUtbetaling(beregningId)?.gjenståendeDager;
};

export interface Tidslinjeperiode {
    id: string;
    unique: string;
    beregningId: string;
    fagsystemId?: string;
    fom: Dayjs;
    tom: Dayjs;
    type: Periodetype;
    tilstand: Tidslinjetilstand;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    fullstendig: boolean;
    opprettet: Dayjs;
}

export enum Utbetalingstatus {
    IKKE_UTBETALT,
    IKKE_GODKJENT,
    GODKJENT,
    SENDT,
    OVERFØRT,
    UTBETALT,
    GODKJENT_UTEN_UTBETALING,
    UTBETALING_FEILET,
    ANNULLERT,
    UKJENT,
    REVURDERT,
}

export enum Periodetype {
    VEDTAKSPERIODE,
    REVURDERING,
    ANNULLERT_PERIODE,
    UFULLSTENDIG,
}
