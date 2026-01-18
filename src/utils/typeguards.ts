import {
    Arbeidsforholdoverstyring,
    Arbeidsgiver,
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
    SelvstendigNaering,
    Sykepengegrunnlagskjonnsfastsetting,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';

export const isInfotrygdPeriod = (period?: TimelinePeriod | null): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (periode?: TimelinePeriod | null): periode is BeregnetPeriodeFragment =>
    (periode as BeregnetPeriodeFragment)?.__typename === 'BeregnetPeriode';

export const isGhostPeriode = (period?: TimelinePeriod | null): period is GhostPeriodeFragment =>
    (period as GhostPeriodeFragment)?.__typename === 'GhostPeriode';

export const isUberegnetPeriode = (period?: TimelinePeriod | null): period is UberegnetPeriodeFragment =>
    (period as UberegnetPeriodeFragment)?.__typename === 'UberegnetPeriode';

export const isDagoverstyring = (overstyring?: Overstyring | null): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring)?.__typename === 'Dagoverstyring';

const isOverstyringPrDag = (overstyring?: Overstyring | null): overstyring is OverstyringerPrDag =>
    typeof (overstyring as Dagoverstyring)?.__typename !== 'string';

export const isOverstyringerPrDag = (overstyringer?: Overstyring[] | null): overstyringer is OverstyringerPrDag[] =>
    overstyringer?.every(isOverstyringPrDag) ?? false;

export const isInntektoverstyring = (overstyring?: Overstyring | null): overstyring is Inntektoverstyring =>
    (overstyring as Inntektoverstyring)?.__typename === 'Inntektoverstyring';

export const isInntektoverstyringer = (overstyringer?: Overstyring[] | null): overstyringer is Inntektoverstyring[] =>
    overstyringer?.every(isInntektoverstyring) ?? false;

export const isArbeidsforholdoverstyring = (
    overstyring?: Overstyring | null,
): overstyring is Arbeidsforholdoverstyring =>
    (overstyring as Arbeidsforholdoverstyring)?.__typename === 'Arbeidsforholdoverstyring';

export const isArbeidsforholdoverstyringer = (
    overstyringer?: Overstyring[] | null,
): overstyringer is Arbeidsforholdoverstyring[] => overstyringer?.every(isArbeidsforholdoverstyring) ?? false;

export const isSykepengegrunnlagskjønnsfastsetting = (
    overstyring?: Overstyring | null,
): overstyring is Sykepengegrunnlagskjonnsfastsetting =>
    (overstyring as Sykepengegrunnlagskjonnsfastsetting)?.__typename === 'Sykepengegrunnlagskjonnsfastsetting';

export const isMinimumSykdomsgradsoverstyring = (
    overstyring?: Overstyring | null,
): overstyring is MinimumSykdomsgradOverstyring =>
    (overstyring as MinimumSykdomsgradOverstyring)?.__typename === 'MinimumSykdomsgradOverstyring';

export const isPerson = (person?: Maybe<PersonFragment | Person>): person is PersonFragment => {
    return person !== undefined && person !== null && typeof person['fodselsnummer'] === 'string';
};

export function isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
    return value != null;
}

export const isNumber = (aNumber: unknown): aNumber is number => {
    return aNumber !== undefined && aNumber !== null && typeof aNumber === 'number';
};

export const isArbeidsgiver = (inntektsforhold?: Inntektsforhold | null): inntektsforhold is Arbeidsgiver => {
    return (inntektsforhold as Arbeidsgiver)?.organisasjonsnummer != undefined;
};

export const isSelvstendigNaering = (
    inntektsforhold?: Inntektsforhold | null,
): inntektsforhold is SelvstendigNaering => {
    return (
        (inntektsforhold as ArbeidsgiverFragment).organisasjonsnummer == undefined &&
        (inntektsforhold as SelvstendigNaering).behandlinger !== undefined
    );
};
