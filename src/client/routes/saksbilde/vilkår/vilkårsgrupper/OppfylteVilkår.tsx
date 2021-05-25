import React from 'react';

import { GrøntSjekkikon } from '../../../../components/ikoner/GrøntSjekkikon';
import { Vilkårdata } from '../../../../mapping/vilkår';

import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel, Vilkårskategori } from '../vilkårstitler';

interface OppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const OppfylteVilkår = ({ vilkår }: OppfylteVilkårProps) => (
    <Vilkårkolonne data-testid="oppfylte-vilkår">
        <Vilkårskategori ikon={<GrøntSjekkikon />}>Oppfylte vilkår</Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <React.Fragment key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </Vilkårkolonne>
);
