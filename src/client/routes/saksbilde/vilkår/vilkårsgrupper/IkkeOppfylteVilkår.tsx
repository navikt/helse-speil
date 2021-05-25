import React from 'react';

import { Feilikon } from '../../../../components/ikoner/Feilikon';
import { Vilkårdata } from '../../../../mapping/vilkår';

import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel, Vilkårskategori } from '../vilkårstitler';

interface IkkeOppfylteVilkårProps {
    vilkår: Vilkårdata[];
}

export const IkkeOppfylteVilkår = ({ vilkår }: IkkeOppfylteVilkårProps) => (
    <Vilkårkolonne data-testid="ikke-oppfylte-vilkår">
        <Vilkårskategori ikon={<Feilikon />}>Ikke oppfylte vilkår</Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <React.Fragment key={i}>
                <Vilkårsgruppetittel type={type} oppfylt={false} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </Vilkårkolonne>
);
