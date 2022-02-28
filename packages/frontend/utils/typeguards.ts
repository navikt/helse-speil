import { BeregnetPeriode, Periode } from '@io/graphql';

export const isBeregnetPeriode = (periode?: Periode): periode is BeregnetPeriode =>
    (periode as BeregnetPeriode)?.beregningId !== null && (periode as BeregnetPeriode)?.beregningId !== undefined;
