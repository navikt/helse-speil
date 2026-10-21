import {
    ApiArbeidsforholdoverstyring,
    ApiArbeidsgiver,
    ApiBeregnetPeriode,
    ApiDagoverstyring,
    ApiGhostPeriode,
    ApiInntektoverstyring,
    ApiMinimumSykdomsgradOverstyring,
    ApiOverstyring,
    ApiSaksbildePerson,
    ApiSelvstendigNaering,
    ApiSykepengegrunnlagskjonnsfastsetting,
    ApiUberegnetPeriode,
} from '@io/rest/generated/spesialist.schemas';
import {
    ApiDialogmelding,
    ApiDialogmeldingFraBehandler,
    ApiDialogmeldingFraNav,
    ApiDialogmeldingFraSystem,
} from '@io/rest/generated/sporhund.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';

export const isInfotrygdPeriod = (period?: TimelinePeriod | null): period is InfotrygdPeriod =>
    (period as InfotrygdPeriod)?.typetekst !== undefined && (period as InfotrygdPeriod)?.typetekst !== null;

export const isBeregnetPeriode = (periode?: TimelinePeriod | null): periode is ApiBeregnetPeriode =>
    (periode as ApiBeregnetPeriode)?.type === 'ApiBeregnetPeriode';

export const isGhostPeriode = (period?: TimelinePeriod | null): period is ApiGhostPeriode =>
    period != null && 'deaktivert' in period && !('type' in period);

export const isUberegnetPeriode = (period?: TimelinePeriod | null): period is ApiUberegnetPeriode =>
    (period as ApiUberegnetPeriode)?.type === 'ApiUberegnetPeriode';

export const isDagoverstyring = (overstyring?: ApiOverstyring | null): overstyring is ApiDagoverstyring =>
    (overstyring as ApiDagoverstyring)?.type === 'ApiDagoverstyring';

const isOverstyringPrDag = (
    overstyring?: ApiOverstyring | OverstyringerPrDag | null,
): overstyring is OverstyringerPrDag => typeof (overstyring as ApiDagoverstyring)?.type !== 'string';

export const isOverstyringerPrDag = (
    overstyringer?: (ApiOverstyring | OverstyringerPrDag)[] | null,
): overstyringer is OverstyringerPrDag[] => overstyringer?.every(isOverstyringPrDag) ?? false;

export const isInntektoverstyring = (overstyring?: ApiOverstyring | null): overstyring is ApiInntektoverstyring =>
    (overstyring as ApiInntektoverstyring)?.type === 'ApiInntektoverstyring';

export const isInntektoverstyringer = (
    overstyringer?: ApiOverstyring[] | null,
): overstyringer is ApiInntektoverstyring[] => overstyringer?.every(isInntektoverstyring) ?? false;

export const isArbeidsforholdoverstyring = (
    overstyring?: ApiOverstyring | null,
): overstyring is ApiArbeidsforholdoverstyring =>
    (overstyring as ApiArbeidsforholdoverstyring)?.type === 'ApiArbeidsforholdoverstyring';

export const isArbeidsforholdoverstyringer = (
    overstyringer?: ApiOverstyring[] | null,
): overstyringer is ApiArbeidsforholdoverstyring[] => overstyringer?.every(isArbeidsforholdoverstyring) ?? false;

export const isSykepengegrunnlagskjønnsfastsetting = (
    overstyring?: ApiOverstyring | null,
): overstyring is ApiSykepengegrunnlagskjonnsfastsetting =>
    (overstyring as ApiSykepengegrunnlagskjonnsfastsetting)?.type === 'ApiSykepengegrunnlagskjonnsfastsetting';

export const isMinimumSykdomsgradsoverstyring = (
    overstyring?: ApiOverstyring | null,
): overstyring is ApiMinimumSykdomsgradOverstyring =>
    (overstyring as ApiMinimumSykdomsgradOverstyring)?.type === 'ApiMinimumSykdomsgradOverstyring';

export const isPerson = (person?: ApiSaksbildePerson | null): person is ApiSaksbildePerson => {
    return person !== undefined && person !== null && typeof person['fodselsnummer'] === 'string';
};

export function isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
    return value != null;
}

export const isNumber = (aNumber: unknown): aNumber is number => {
    return aNumber !== undefined && aNumber !== null && typeof aNumber === 'number';
};

export const isArbeidsgiver = (inntektsforhold?: Inntektsforhold | null): inntektsforhold is ApiArbeidsgiver => {
    return (inntektsforhold as ApiArbeidsgiver)?.organisasjonsnummer != undefined;
};

export const isSelvstendigNaering = (
    inntektsforhold?: Inntektsforhold | null,
): inntektsforhold is ApiSelvstendigNaering => {
    return (
        (inntektsforhold as ApiArbeidsgiver).organisasjonsnummer == undefined &&
        (inntektsforhold as ApiSelvstendigNaering).behandlinger !== undefined
    );
};

export const erFraBehandler = (melding: ApiDialogmelding): melding is ApiDialogmeldingFraBehandler =>
    'antallVedlegg' in melding;

export const erFraNav = (melding: ApiDialogmelding): melding is ApiDialogmeldingFraNav => 'saksbehandler' in melding;

export const erFraSystem = (melding: ApiDialogmelding): melding is ApiDialogmeldingFraSystem =>
    !erFraBehandler(melding) && !erFraNav(melding);
