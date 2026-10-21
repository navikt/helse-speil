import { ApiInntektskilde } from '@io/rest/generated/spesialist.schemas';

export const kildeForkortelse = (kilde?: ApiInntektskilde) => {
    switch (kilde) {
        case ApiInntektskilde.SAKSBEHANDLER:
            return 'SB';
        case ApiInntektskilde.INNTEKTSMELDING:
            return 'IM';
        case ApiInntektskilde.INFOTRYGD:
            return 'IT';
        case ApiInntektskilde.AORDNINGEN:
            return 'AO';
        default:
            return '-';
    }
};
