export interface Lovhjemmel {
    paragraf: string;
    ledd?: string;
    bokstav?: string;
    lovverk: string;
    lovverksversjon: string;
}
export interface BegrunnelseForOverstyring {
    id: string;
    forklaring: string;
    lovhjemmel?: Lovhjemmel;
}
