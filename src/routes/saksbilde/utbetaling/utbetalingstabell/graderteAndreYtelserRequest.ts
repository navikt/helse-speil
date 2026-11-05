import dayjs from 'dayjs';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { isArbeidsgiver } from '@utils/typeguards';

type Yrkesaktivitet = Pick<ApiEndreGraderteAndreYtelserRequest, 'yrkesaktivitet' | 'organisasjonsnummer'>;

export function tilGraderteAndreYtelserRequest({
    overstyrteDager,
    inntektsforhold,
    graderteAndreYtelser,
    behandlingId,
    notatTilBeslutter,
}: {
    overstyrteDager: Utbetalingstabelldag[];
    inntektsforhold: Inntektsforhold;
    graderteAndreYtelser: ApiGraderteAndreYtelser[];
    behandlingId: string;
    notatTilBeslutter: string;
}): ApiEndreGraderteAndreYtelserRequest {
    const lagrede = finnGraderteAndreYtelser(graderteAndreYtelser, inntektsforhold);
    return {
        ...tilYrkesaktivitet(inntektsforhold),
        versjon: lagrede?.versjon ?? null,
        behandlingId,
        notatTilBeslutter,
        dager: overstyrteDager.flatMap((dag) => {
            if (dag.gradertAnnenYtelse) return [tilGraderteAndreYtelserDag(dag)];
            const lagretDag = lagrede?.dager.find((it) => it.dato === dayjs(dag.dato).format('YYYY-MM-DD'));
            return harFordeling(lagretDag) ? [tilDagUtenFordeling(lagretDag)] : [];
        }),
    };
}

export function harFordeling(
    lagretDag: ApiGraderteAndreYtelserDag | undefined,
): lagretDag is ApiGraderteAndreYtelserDag {
    return lagretDag !== undefined && Object.keys(lagretDag.andreYtelserGrader).length > 0;
}

export function finnGraderteAndreYtelser(
    graderteAndreYtelser: ApiGraderteAndreYtelser[],
    inntektsforhold: Inntektsforhold,
): ApiGraderteAndreYtelser | undefined {
    const { yrkesaktivitet, organisasjonsnummer } = tilYrkesaktivitet(inntektsforhold);
    return graderteAndreYtelser.find(
        (it) => it.yrkesaktivitet === yrkesaktivitet && (it.organisasjonsnummer ?? null) === organisasjonsnummer,
    );
}

function tilYrkesaktivitet(inntektsforhold: Inntektsforhold): Yrkesaktivitet {
    return isArbeidsgiver(inntektsforhold)
        ? {
              yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
              organisasjonsnummer: inntektsforhold.organisasjonsnummer,
          }
        : { yrkesaktivitet: ApiYrkesaktivitetstype.SELVSTENDIG, organisasjonsnummer: null };
}

function tilGraderteAndreYtelserDag({
    dato,
    dag,
    gradertAnnenYtelse,
}: Utbetalingstabelldag): ApiGraderteAndreYtelserDag {
    if (dag.gradertAnnenYtelsetype === undefined || !gradertAnnenYtelse) {
        throw Error(`Dag ${dato} mangler gyldig gradert annen ytelse.`);
    }
    const { sykdomsgrad, andreYtelseGrad, sykdomsgradFørFordeling } = gradertAnnenYtelse;
    return {
        dato: dayjs(dato).format('YYYY-MM-DD'),
        andreYtelserGrader: { [dag.gradertAnnenYtelsetype]: andreYtelseGrad },
        sykdomsgrad,
        sykdomsgradFørFordeling,
        arbeidsgrad: 100 - sykdomsgrad - andreYtelseGrad,
    };
}

// Spec-regel 6: uten ytelser skal sykdomsgraden være lik sykdomsgraden før fordeling, så trekket blir 0
function tilDagUtenFordeling({
    dato,
    sykdomsgradFørFordeling,
}: ApiGraderteAndreYtelserDag): ApiGraderteAndreYtelserDag {
    return {
        dato,
        andreYtelserGrader: {},
        sykdomsgrad: sykdomsgradFørFordeling,
        sykdomsgradFørFordeling,
        arbeidsgrad: 100 - sykdomsgradFørFordeling,
    };
}
