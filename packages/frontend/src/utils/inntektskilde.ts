import { Inntektskilde } from '@io/graphql';

export const kildeForkortelse = (kilde?: Inntektskilde) => {
    switch (kilde) {
        case Inntektskilde.Saksbehandler:
            return 'SB';
        case Inntektskilde.Inntektsmelding:
            return 'IM';
        case Inntektskilde.Infotrygd:
            return 'IT';
        case Inntektskilde.Aordningen:
            return 'AO';
        default:
            return '-';
    }
};
