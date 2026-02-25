export interface Vilkårshjemmel {
    lovverk: string;
    lovverksversjon: string;
    kapittel: string;
    paragraf: string;
    ledd: string | null;
    setning: string | null;
    bokstav?: string | null;
}

export interface Vilkårsresultat {
    kode: string;
    beskrivelse: string;
    vilkårshjemmel: Vilkårshjemmel;
}

export interface Vilkårskode {
    vilkårshjemmel: Vilkårshjemmel;
    beskrivelse: string;
    oppfylt: Vilkårsresultat[];
    ikkeOppfylt: Vilkårsresultat[];
}

export interface Alternativ {
    kode: string;
    navn: string;
    harUnderspørsmål: boolean;
    underspørsmål: Underspørsmål[];
}

export interface Underspørsmål {
    kode: string;
    navn?: string;
    variant: string;
    alternativer: Alternativ[];
}

export interface SaksbehandlerUiKodeverk {
    vilkårskode: string;
    beskrivelse: string;
    kategori: string;
    paragrafTag: string;
    underspørsmål: Underspørsmål[];
}
