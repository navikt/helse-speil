import React from 'react';

import { Advarselikon } from '@components/ikoner/Advarselikon';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårgrid, Vilkårgruppe, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårskategori } from '../Vilkårskategori';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Yrkeskadeinfo } from './Yrkesskadeinfo';

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
        <Yrkeskadeinfo style={{ marginTop: '2rem' }} />
    </Vilkårkolonne>
);
