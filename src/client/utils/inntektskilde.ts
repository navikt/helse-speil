export const kilde = (kilde?: OmregnetÅrsinntekt['kilde']) => {
    switch (kilde) {
        case 'Saksbehandler':
            return 'SB';
        case 'Inntektsmelding':
            return 'IM';
        case 'Infotrygd':
            return 'IT';
        case 'AOrdningen':
            return 'AO';
        default:
            return '-';
    }
};

export const getKildeType = (inntektskilde?: OmregnetÅrsinntekt['kilde']): Sykdomsdag['kilde'] | undefined => {
    switch (inntektskilde) {
        case 'Saksbehandler':
            return 'Saksbehandler';
        case 'Inntektsmelding':
            return 'Inntektsmelding';
        case 'AOrdningen':
            return 'Aordningen';
        case 'Infotrygd':
        default:
            return undefined;
    }
};
