import { ANNEN_YTELSE_OPTIONS, AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import {
    ApiGraderteAndreYtelseType,
    ApiLeggTilGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { norskDatoTilIsoDato } from '@utils/date';

const ytelseTilApiType: Record<(typeof ANNEN_YTELSE_OPTIONS)[number], ApiGraderteAndreYtelseType> = {
    Foreldrepenger: ApiGraderteAndreYtelseType.FORELDREPENGER,
    Svangerskapspenger: ApiGraderteAndreYtelseType.SVANGERSKAPSPENGER,
    Pleiepenger: ApiGraderteAndreYtelseType.PLEIEPENGER,
    Omsorgspenger: ApiGraderteAndreYtelseType.OMSORGSPENGER,
    Opplæringspenger: ApiGraderteAndreYtelseType.OPPLARINGSPENGER,
};

export const tilGraderteAndreYtelserRequest = (
    values: AndreYtelserSchema,
    fodselsnummer: string,
): ApiLeggTilGraderteAndreYtelserRequest => ({
    fodselsnummer,
    andreYtelseType: ytelseTilApiType[values.ytelse],
    perioder: values.perioder.map((periode) => ({
        fom: norskDatoTilIsoDato(periode.fom),
        tom: norskDatoTilIsoDato(periode.tom),
        grad: periode.grad,
    })),
    notatTilBeslutter: values.notat,
});
