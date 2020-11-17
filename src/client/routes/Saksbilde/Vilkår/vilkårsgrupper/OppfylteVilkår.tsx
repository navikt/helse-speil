import React from 'react';
import { Vilkårsgruppetittel, Vilkårskategori } from '../vilkårstitler';
import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { GrøntSjekkikon } from '../../../../components/ikoner/GrøntSjekkikon';
import { Risikovurdering } from 'internal-types';

interface OppfylteVilkårProps {
    vilkår: Vilkårdata[];
    risikovurdering?: Risikovurdering;
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
