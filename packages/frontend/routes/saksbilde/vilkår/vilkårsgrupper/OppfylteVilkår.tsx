import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårgrid, Vilkårgruppe, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårskategori } from '../Vilkårskategori';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import React from 'react';

import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';

interface OppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const OppfylteVilkår = ({ vilkår }: OppfylteVilkårProps) => (
    <Vilkårkolonne data-testid="oppfylte-vilkår" aria-labelledby="oppfylte-vilkår">
        <Vilkårskategori id="oppfylte-vilkår" ikon={<GrøntSjekkikon />}>
            Oppfylte vilkår
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <Vilkårgruppe key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </Vilkårgruppe>
        ))}
    </Vilkårkolonne>
);
