import { ReactNode } from 'react';

export enum Vilkårstype {
    Opptjeningstid = 'opptjening',
    Sykepengegrunnlag = 'sykepengegrunnlag',
    Medlemskap = 'medlemskap',
}

export interface Vilkårdata {
    type: Vilkårstype;
    tittel: string;
    komponent: ReactNode;
    oppfylt: boolean | null;
    paragraf?: ReactNode;
}
