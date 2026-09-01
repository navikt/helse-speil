import { ApiGraderteAndreYtelserType } from '@io/rest/generated/spesialist.schemas';

export const andreYtelserTypeTilNavn: Record<ApiGraderteAndreYtelserType, string> = {
    [ApiGraderteAndreYtelserType.FORELDREPENGER]: 'Foreldrepenger',
    [ApiGraderteAndreYtelserType.SVANGERSKAPSPENGER]: 'Svangerskapspenger',
    [ApiGraderteAndreYtelserType.OMSORGSPENGER]: 'Omsorgspenger',
    [ApiGraderteAndreYtelserType.PLEIEPENGER]: 'Pleiepenger',
    [ApiGraderteAndreYtelserType.OPPLARINGSPENGER]: 'Opplæringspenger',
};
