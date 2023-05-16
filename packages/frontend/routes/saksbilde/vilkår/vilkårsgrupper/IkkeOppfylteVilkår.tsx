import React from 'react';

import { Feilikon } from '@components/ikoner/Feilikon';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårgrid, Vilkårgruppe, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

interface IkkeOppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeOppfylteVilkår = ({ vilkår }: IkkeOppfylteVilkårProps) => (
    <Vilkårkolonne data-testid="ikke-oppfylte-vilkår" aria-labelledby="ikke-oppfylte-vilkår">
        <Vilkårskategori id="ikke-oppfylte-vilkår" ikon={<Feilikon />}>
            Ikke oppfylte vilkår
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <Vilkårgruppe key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={false} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </Vilkårgruppe>
        ))}
    </Vilkårkolonne>
);
