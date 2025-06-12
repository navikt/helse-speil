import {
    Arbeidsforholdoverstyring,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    GhostPeriodeFragment,
    Inntektoverstyring,
    Maybe,
    MinimumSykdomsgradOverstyring,
    Overstyring,
    Person,
    PersonFragment,
    Sykepengegrunnlagskjonnsfastsetting,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';

export const isInfotrygdPeriod = (period?: Maybe<TimelinePeriod>): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (periode?: Maybe<TimelinePeriod>): periode is BeregnetPeriodeFragment =>
    (periode as BeregnetPeriodeFragment)?.__typename === 'BeregnetPeriode';

export const isGhostPeriode = (period?: Maybe<TimelinePeriod>): period is GhostPeriodeFragment =>
    (period as GhostPeriodeFragment)?.__typename === 'GhostPeriode';

export const isUberegnetPeriode = (period?: Maybe<TimelinePeriod>): period is UberegnetPeriodeFragment =>
    (period as UberegnetPeriodeFragment)?.__typename === 'UberegnetPeriode';

export const isDagoverstyring = (overstyring?: Maybe<Overstyring>): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring)?.__typename === 'Dagoverstyring';

const isOverstyringPrDag = (overstyring?: Maybe<Overstyring>): overstyring is OverstyringerPrDag =>
    typeof (overstyring as Dagoverstyring)?.__typename !== 'string';

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

export const isSykepengegrunnlagskjønnsfastsetting = (
    overstyring?: Maybe<Overstyring>,
): overstyring is Sykepengegrunnlagskjonnsfastsetting =>
    (overstyring as Sykepengegrunnlagskjonnsfastsetting)?.__typename === 'Sykepengegrunnlagskjonnsfastsetting';

export const isMinimumSykdomsgradsoverstyring = (
    overstyring?: Maybe<Overstyring>,
): overstyring is MinimumSykdomsgradOverstyring =>
    (overstyring as MinimumSykdomsgradOverstyring)?.__typename === 'MinimumSykdomsgradOverstyring';

export const isPerson = (person?: Maybe<PersonFragment | Person>): person is PersonFragment => {
    return person !== undefined && person !== null && typeof person['fodselsnummer'] === 'string';
};

export const isArbeidsgiver = (arbeidsgiver?: Maybe<ArbeidsgiverFragment>): arbeidsgiver is ArbeidsgiverFragment => {
    return arbeidsgiver !== undefined && arbeidsgiver !== null;
};

export function isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
    return value != null;
}
