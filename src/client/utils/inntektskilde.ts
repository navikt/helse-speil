import { Inntektskildetype } from 'internal-types';

export const kilde = (kilde?: Inntektskildetype) => {
    switch (kilde) {
        case Inntektskildetype.Saksbehandler:
            return 'SB';
        case Inntektskildetype.Inntektsmelding:
            return 'IM';
        case Inntektskildetype.Infotrygd:
            return 'IT';
        case Inntektskildetype.AOrdningen:
            return 'AO';
        default:
            return '-';
    }
};
