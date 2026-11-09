import type { GraderteAndreYtelserFormFields } from '@form-schemas/graderteAndreYtelserSkjema';
import { PostGraderteAndreYtelserMutationError } from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import { typeendringerAndreYtelser } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import type { Dagendring, Fordeling } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/types';

export function tilGraderteAndreYtelserEndring(values: GraderteAndreYtelserFormFields): Dagendring {
    const gradertAnnenYtelse: Fordeling = {
        sykdomsgrad: values.sykepengerGrad ?? 0,
        andreYtelseGrad: values.gradAndreYtelser ?? 0,
        begrunnelse: values.begrunnelse,
    };
    return {
        grad: gradertAnnenYtelse.sykdomsgrad + gradertAnnenYtelse.andreYtelseGrad,
        dag: typeendringerAndreYtelser.find((dag) => dag.speilDagtype === values.ytelse)!,
        erAvvist: false,
        erForeldet: false,
        gradertAnnenYtelse,
    };
}

export function somGraderteAndreYtelserFeilmelding(error: PostGraderteAndreYtelserMutationError): string | undefined {
    // sp-andre-ytelser svarer 403 uten feilkode når saksbehandler mangler skrivetilgang til personen
    if (error.status === 403) return 'Du har ikke tilgang til å endre graderte andre ytelser for denne personen.';

    switch (error.info?.code) {
        case 'GRAD_UTENFOR_GRENSER':
            return 'Sykdomsgrad og andre ytelser kan til sammen ikke være mer enn 100 %. Sykdomsgraden må være minst 1 og ikke høyere enn før fordeling, og hver ytelse må være mellom 1 og 99.';
        case 'SUM_ER_IKKE_100':
            return 'Sykdomsgrad, arbeidsgrad og andre ytelser må til sammen bli 100 %.';
        case 'ARBEIDSGRAD_OKER':
            return 'Arbeidsgraden kan ikke øke. Sykdomsgrad og andre ytelser må til sammen være minst like høye som sykdomsgraden før fordeling.';
        case 'YTELSER_MANGLER_TREKK':
            return 'Sykdomsgraden må være lik sykdomsgraden før fordeling når dagen ikke har andre ytelser.';
        case 'MANGLER_BEGRUNNELSE':
            return 'Hver dag må ha en begrunnelse.';
        case 'MANGLER_ENDRINGER':
            return 'Det er ingen endringer i fordelingene å lagre.';
        case 'UTDATERT_TILSTAND':
            return 'Graderte andre ytelser er endret siden du åpnet saken. Se over endringene og prøv igjen.';
        default:
            return undefined;
    }
}
