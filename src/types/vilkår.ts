import { ReactNode } from 'react';

import { Maybe } from '@io/graphql';

export enum Vilkårstype {
    Opptjeningstid = 'opptjening',
    Sykepengegrunnlag = 'sykepengegrunnlag',
    Medlemskap = 'medlemskap',
}

export interface Vilkårdata {
    type: Vilkårstype;
    tittel: string;
    komponent: ReactNode;
    oppfylt: Maybe<boolean>;
    paragraf?: ReactNode;
}
