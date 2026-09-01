import {
    AndreYtelserSchema,
    AndreYtelserSkjemaInput,
    YtelseValg,
    ytelseTilApiType,
} from '@/form-schemas/andreYtelserSchema';
import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserPeriode,
    ApiGraderteAndreYtelserType,
    ApiLeggTilGraderteAndreYtelserRequest,
    ApiPatchEndreGraderteAndreYtelserRequest,
    ApiPostGjenopprettGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { norskDatoTilIsoDato, somNorskDato } from '@utils/date';

const apiTypeTilYtelse: Record<ApiGraderteAndreYtelserType, YtelseValg> = {
    [ApiGraderteAndreYtelserType.FORELDREPENGER]: 'Foreldrepenger',
    [ApiGraderteAndreYtelserType.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
    [ApiGraderteAndreYtelserType.PLEIEPENGER]: 'Pleiepenger',
    [ApiGraderteAndreYtelserType.OMSORGSPENGER]: 'Omsorgspenger',
    [ApiGraderteAndreYtelserType.OPPLARINGSPENGER]: 'Opplæringspenger',
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
    andreYtelserType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

export const tilEndreGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
    graderteAndreYtelserId: string,
): ApiPatchEndreGraderteAndreYtelserRequest => ({
    graderteAndreYtelserId,
    andreYtelserType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

export const tilGjenopprettGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
): ApiPostGjenopprettGraderteAndreYtelserRequest => ({
    andreYtelserType: ytelseTilApiType[values.ytelse],
    perioder: tilApiPerioder(values),
    notatTilBeslutter: values.notat,
});

/** Fyller skjemaet med verdiene fra en eksisterende ytelse. Notat til beslutter starter alltid tomt. */
export const tilAndreYtelserSkjemaverdier = (ytelse: ApiGraderteAndreYtelser): AndreYtelserSkjemaInput => ({
    ytelse: apiTypeTilYtelse[ytelse.andreYtelserType],
    perioder: ytelse.perioder.map((periode) => ({
        fom: somNorskDato(periode.fom) ?? '',
        tom: somNorskDato(periode.tom) ?? '',
        grad: periode.grad,
    })),
    notat: '',
});
