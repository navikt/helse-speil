import { ReactNode } from 'react';

export enum Vilkårstype {
    Alder = 'alder',
    Søknadsfrist = 'søknadsfrist',
    Opptjeningstid = 'opptjening',
    Sykepengegrunnlag = 'sykepengegrunnlag',
    DagerIgjen = 'dagerIgjen',
    Medlemskap = 'medlemskap',
    Institusjonsopphold = 'institusjonsopphold',
    Risikovurdering = 'risikovurdering',
    Arbeidsuførhet = 'arbeidsuførhet',
    Medvirkning = 'medvirkning',
}

export interface Vilkårdata {
    type: Vilkårstype;
    tittel: string;
    komponent: ReactNode;
    oppfylt: boolean | null;
    paragraf?: ReactNode;
}
