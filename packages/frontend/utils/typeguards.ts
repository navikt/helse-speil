import { BeregnetPeriode, GhostPeriode, Maybe, Periode, UberegnetPeriode } from '@io/graphql';

export const isInfotrygdPeriod = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (periode?: Maybe<GhostPeriode | Periode | DatePeriod>): periode is BeregnetPeriode =>
    (periode as BeregnetPeriode)?.beregningId !== null && (periode as BeregnetPeriode)?.beregningId !== undefined;

export const isGhostPeriode = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is GhostPeriode =>
    typeof (period as any)?.deaktivert === 'boolean';

export const isUberegnetPeriode = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is UberegnetPeriode =>
    period !== null &&
    period !== undefined &&
    !isBeregnetPeriode(period) &&
    !isGhostPeriode(period) &&
    !isInfotrygdPeriod(period);
