import React from 'react';

import { Advarselikon } from '@components/ikoner/Advarselikon';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårgrid, Vilkårgruppe, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../Vilkårsgruppetittel';
import { Vilkårskategori } from '../Vilkårskategori';

interface IkkeVurderteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeVurderteVilkår = ({ vilkår }: IkkeVurderteVilkårProps) => (
    <Vilkårkolonne data-testid="ikke-vurderte-vilkår" aria-labelledby="vilkår-til-vurdering">
        <Vilkårskategori id="vilkår-til-vurdering" ikon={<Advarselikon />}>
            Vilkår til vurdering
        </Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <Vilkårgruppe key={i}>
                <Vilkårsgruppetittel type={type} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
            </Vilkårgruppe>
        ))}
    </Vilkårkolonne>
);
