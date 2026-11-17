import dayjs from 'dayjs';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { finnGraderteAndreYtelser, tilYrkesaktivitet } from '@state/graderteAndreYtelser';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { GradertAnnenYtelse, Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { samletGrad } from './graderteAndreYtelserUtils';

export function tilGraderteAndreYtelserRequest({
    overstyrteDager,
    inntektsforhold,
    graderteAndreYtelser,
    behandlingId,
    begrunnelse,
}: {
    overstyrteDager: Utbetalingstabelldag[];
    inntektsforhold: Inntektsforhold;
    graderteAndreYtelser: ApiGraderteAndreYtelser[];
    behandlingId: string;
    begrunnelse: string;
}): ApiEndreGraderteAndreYtelserRequest {
    const lagrede = finnGraderteAndreYtelser(graderteAndreYtelser, inntektsforhold);
    return {
        ...tilYrkesaktivitet(inntektsforhold),
        versjon: lagrede?.versjon ?? null,
        behandlingId,
        dager: overstyrteDager.flatMap((dag) => {
            if (dag.gradertAnnenYtelse) return [tilGraderteAndreYtelserDag(dag.dato, dag.gradertAnnenYtelse)];
            const lagretDag = lagrede?.dager.find((it) => it.dato === dayjs(dag.dato).format('YYYY-MM-DD'));
            return harFordeling(lagretDag) ? [tilDagUtenFordeling(lagretDag, begrunnelse)] : [];
        }),
    };
}

export function harFordeling(
    lagretDag: ApiGraderteAndreYtelserDag | undefined,
): lagretDag is ApiGraderteAndreYtelserDag {
    return lagretDag !== undefined && Object.keys(lagretDag.andreYtelserGrader).length > 0;
}

function tilGraderteAndreYtelserDag(
    dato: string,
    { sykdomsgrad, andreYtelserGrader, sykdomsgradFørFordeling, begrunnelse }: GradertAnnenYtelse,
): ApiGraderteAndreYtelserDag {
    return {
        dato: dayjs(dato).format('YYYY-MM-DD'),
        andreYtelserGrader,
        sykdomsgrad,
        sykdomsgradFørFordeling,
        arbeidsgrad: 100 - sykdomsgrad - samletGrad(andreYtelserGrader),
        begrunnelse,
    };
}

// Spec-regel 6: uten ytelser skal sykdomsgraden være lik sykdomsgraden før fordeling, så trekket blir 0
function tilDagUtenFordeling(
    { dato, sykdomsgradFørFordeling }: ApiGraderteAndreYtelserDag,
    begrunnelse: string,
): ApiGraderteAndreYtelserDag {
    return {
        dato,
        andreYtelserGrader: {},
        sykdomsgrad: sykdomsgradFørFordeling,
        sykdomsgradFørFordeling,
        arbeidsgrad: 100 - sykdomsgradFørFordeling,
        begrunnelse,
    };
}
