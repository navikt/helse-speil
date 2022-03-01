import { BeregnetPeriode, GhostPeriode, Maybe, Periode } from '@io/graphql';

export const isBeregnetPeriode = (periode?: Maybe<GhostPeriode | Periode>): periode is BeregnetPeriode =>
    (periode as BeregnetPeriode)?.beregningId !== null && (periode as BeregnetPeriode)?.beregningId !== undefined;

export const isGhostPeriode = (period?: Maybe<GhostPeriode | Periode>): period is GhostPeriode =>
    typeof (period as any)?.deaktivert === 'boolean';
