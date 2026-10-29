import dayjs from 'dayjs';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/spesialist.schemas';
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
    const yrkesaktivitet: Yrkesaktivitet = isArbeidsgiver(inntektsforhold)
        ? {
              yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
              organisasjonsnummer: inntektsforhold.organisasjonsnummer,
          }
        : { yrkesaktivitet: ApiYrkesaktivitetstype.SELVSTENDIG, organisasjonsnummer: null };
    return {
        ...yrkesaktivitet,
        versjon: finnVersjon(graderteAndreYtelser, yrkesaktivitet),
        behandlingId,
        notatTilBeslutter,
        dager: overstyrteDager.filter((dag) => dag.gradertAnnenYtelse).map(tilGraderteAndreYtelserDag),
    };
}

function finnVersjon(
    graderteAndreYtelser: ApiGraderteAndreYtelser[],
    { yrkesaktivitet, organisasjonsnummer }: Yrkesaktivitet,
): string | null {
    const eksisterende = graderteAndreYtelser.find(
        (it) => it.yrkesaktivitet === yrkesaktivitet && (it.organisasjonsnummer ?? null) === organisasjonsnummer,
    );
    return eksisterende?.versjon ?? null;
}

function tilGraderteAndreYtelserDag({
    dato,
    dag,
    gradertAnnenYtelse,
}: Utbetalingstabelldag): ApiGraderteAndreYtelserDag {
    if (dag.gradertAnnenYtelsetype === undefined || !gradertAnnenYtelse) {
        throw Error(`Dag ${dato} mangler gyldig gradert annen ytelse.`);
    }
    const { sykdomsgrad, andreYtelseGrad } = gradertAnnenYtelse;
    return {
        dato: dayjs(dato).format('YYYY-MM-DD'),
        andreYtelserGrader: { [dag.gradertAnnenYtelsetype]: andreYtelseGrad },
        sykdomsgrad,
        arbeidsgrad: 100 - sykdomsgrad - andreYtelseGrad,
    };
}
