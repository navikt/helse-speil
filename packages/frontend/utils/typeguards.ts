import {
    Arbeidsforholdoverstyring,
    Arbeidsgiver,
    BeregnetPeriode,
    Dagoverstyring,
    GhostPeriode,
    Inntektoverstyring,
    Maybe,
    Overstyring,
    Periode,
    UberegnetPeriode,
    Vilkarsgrunnlag,
    VilkarsgrunnlagInfotrygd,
    VilkarsgrunnlagSpleis,
    Vilkarsgrunnlagtype,
} from '@io/graphql';

export const isInfotrygdPeriod = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (
    periode?: Maybe<GhostPeriode | Periode | DatePeriod> | any,
): periode is FetchedBeregnetPeriode =>
    (periode as BeregnetPeriode)?.beregningId !== null && (periode as BeregnetPeriode)?.beregningId !== undefined;

export const isGhostPeriode = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is GhostPeriode =>
    typeof (period as any)?.deaktivert === 'boolean';

export const isUberegnetPeriode = (period?: Maybe<GhostPeriode | Periode | DatePeriod>): period is UberegnetPeriode =>
    period !== null &&
    period !== undefined &&
    !isBeregnetPeriode(period) &&
    !isGhostPeriode(period) &&
    !isInfotrygdPeriod(period);

export const isSpleisVilkarsgrunnlag = (
    vilkårsgrunnlag?: Maybe<Vilkarsgrunnlag>,
): vilkårsgrunnlag is VilkarsgrunnlagSpleis => vilkårsgrunnlag?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis;

export const isInfotrygdVilkarsgrunnlag = (
    vilkårsgrunnlag?: Maybe<Vilkarsgrunnlag>,
): vilkårsgrunnlag is VilkarsgrunnlagInfotrygd =>
    vilkårsgrunnlag?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Infotrygd;

export const isDagoverstyring = (overstyring?: Maybe<Overstyring>): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring)?.__typename === 'Dagoverstyring';

const isOverstyringPrDag = (overstyring?: Maybe<Overstyring>): overstyring is OverstyringerPrDag =>
    typeof (overstyring as Dagoverstyring)?.__typename !== 'string' ?? false;

export const isOverstyringerPrDag = (
    overstyringer?: Maybe<Array<Overstyring>>,
): overstyringer is Array<OverstyringerPrDag> => overstyringer?.every(isOverstyringPrDag) ?? false;

export const isInntektoverstyring = (overstyring?: Maybe<Overstyring>): overstyring is Inntektoverstyring =>
    (overstyring as Inntektoverstyring)?.__typename === 'Inntektoverstyring';

export const isInntektoverstyringer = (
    overstyringer?: Maybe<Array<Overstyring>>,
): overstyringer is Array<Inntektoverstyring> => overstyringer?.every(isInntektoverstyring) ?? false;

export const isArbeidsforholdoverstyring = (
    overstyring?: Maybe<Overstyring>,
): overstyring is Arbeidsforholdoverstyring =>
    (overstyring as Arbeidsforholdoverstyring)?.__typename === 'Arbeidsforholdoverstyring';

export const isArbeidsforholdoverstyringer = (
    overstyringer?: Maybe<Array<Overstyring>>,
): overstyringer is Array<Arbeidsforholdoverstyring> => overstyringer?.every(isArbeidsforholdoverstyring) ?? false;

export const isPerson = (person?: Maybe<FetchedPerson | any>): person is FetchedPerson => {
    return person !== undefined && person !== null && typeof person['fodselsnummer'] === 'string';
};

export const isArbeidsgiver = (arbeidsgiver?: Maybe<Arbeidsgiver>): arbeidsgiver is Arbeidsgiver => {
    return arbeidsgiver !== undefined && arbeidsgiver !== null;
};
