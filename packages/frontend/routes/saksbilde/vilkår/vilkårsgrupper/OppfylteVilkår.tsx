import React from 'react';

import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårgrid, Vilkårgruppe, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

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
