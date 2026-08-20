import { ApiGraderteAndreYtelseType } from '@io/rest/generated/spesialist.schemas';

export const andreYtelseTypeTilNavn: Record<ApiGraderteAndreYtelseType, string> = {
    [ApiGraderteAndreYtelseType.FORELDREPENGER]: 'Foreldrepenger',
    [ApiGraderteAndreYtelseType.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
    [ApiGraderteAndreYtelseType.OMSORGSPENGER]: 'Omsorgspenger',
    [ApiGraderteAndreYtelseType.PLEIEPENGER]: 'Pleiepenger',
    [ApiGraderteAndreYtelseType.OPPLARINGSPENGER]: 'Opplæringspenger',
};
