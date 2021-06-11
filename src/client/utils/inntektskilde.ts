import { Inntektskildetype, Kildetype } from 'internal-types';

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

export const getKildeType = (inntektskilde?: Inntektskildetype): Kildetype | undefined => {
    switch (inntektskilde) {
        case Inntektskildetype.Saksbehandler:
            return Kildetype.Saksbehandler;
        case Inntektskildetype.Inntektsmelding:
            return Kildetype.Inntektsmelding;
        case Inntektskildetype.AOrdningen:
            return Kildetype.Aordningen;
        case Inntektskildetype.Infotrygd:
        default:
            return undefined;
    }
};
