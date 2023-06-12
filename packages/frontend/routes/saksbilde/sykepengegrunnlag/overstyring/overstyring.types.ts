export interface Subsumsjon {
    paragraf: string;
    ledd?: string;
    bokstav?: string;
}
export interface BegrunnelseForOverstyring {
    id: string;
    forklaring: string;
    subsumsjon?: Subsumsjon;
}
