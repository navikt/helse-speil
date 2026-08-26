import { ANNEN_YTELSE_OPTIONS, AndreYtelserSchema, AndreYtelserSkjemaInput } from '@/form-schemas/andreYtelserSchema';
import {
    ApiGraderteAndreYtelseType,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserPeriode,
    ApiLeggTilGraderteAndreYtelserRequest,
    ApiPatchEndreGraderteAndreYtelserRequest,
    ApiPostGjenopprettGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { norskDatoTilIsoDato, somNorskDato } from '@utils/date';

type YtelseValg = (typeof ANNEN_YTELSE_OPTIONS)[number];

const ytelseTilApiType: Record<YtelseValg, ApiGraderteAndreYtelseType> = {
    Foreldrepenger: ApiGraderteAndreYtelseType.FORELDREPENGER,
    Svangerskapspenger: ApiGraderteAndreYtelseType.SVANGERSKAPSPENGER,
    Pleiepenger: ApiGraderteAndreYtelseType.PLEIEPENGER,
    Omsorgspenger: ApiGraderteAndreYtelseType.OMSORGSPENGER,
    Opplæringspenger: ApiGraderteAndreYtelseType.OPPLARINGSPENGER,
};

const apiTypeTilYtelse: Record<ApiGraderteAndreYtelseType, YtelseValg> = {
    [ApiGraderteAndreYtelseType.FORELDREPENGER]: 'Foreldrepenger',
    [ApiGraderteAndreYtelseType.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
    [ApiGraderteAndreYtelseType.PLEIEPENGER]: 'Pleiepenger',
    [ApiGraderteAndreYtelseType.OMSORGSPENGER]: 'Omsorgspenger',
    [ApiGraderteAndreYtelseType.OPPLARINGSPENGER]: 'Opplæringspenger',
};

const tilApiPerioder = (values: AndreYtelserSchema): ApiGraderteAndreYtelserPeriode[] =>
    values.perioder.map((periode) => ({
        fom: norskDatoTilIsoDato(periode.fom),
        tom: norskDatoTilIsoDato(periode.tom),
        grad: periode.grad,
    }));

export const tilGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
    fodselsnummer: string,
): ApiLeggTilGraderteAndreYtelserRequest => ({
    fodselsnummer,
    andreYtelseType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

export const tilEndreGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
    graderteAndreYtelserId: string,
): ApiPatchEndreGraderteAndreYtelserRequest => ({
    graderteAndreYtelserId,
    andreYtelseType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

export const tilGjenopprettGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
): ApiPostGjenopprettGraderteAndreYtelserRequest => ({
    andreYtelseType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

/** Fyller skjemaet med verdiene fra en eksisterende ytelse. Notat til beslutter starter alltid tomt. */
export const tilAndreYtelserSkjemaverdier = (ytelse: ApiGraderteAndreYtelser): AndreYtelserSkjemaInput => ({
    ytelse: apiTypeTilYtelse[ytelse.andreYtelseType],
    perioder: ytelse.perioder.map((periode) => ({
        fom: somNorskDato(periode.fom) ?? '',
        tom: somNorskDato(periode.tom) ?? '',
        grad: periode.grad,
    })),
    notat: '',
});
