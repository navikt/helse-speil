import React from 'react';
import { Vilkårstittel } from '../Vilkårstittel';
import { FlexColumn } from '../../../../components/Flex';
import { Vilkårgrid } from '../Vilkår.styles';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { GrøntSjekkikon } from '../../../../components/ikoner/GrøntSjekkikon';
import { Risikovurdering } from 'internal-types';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';

interface OppfylteVilkårProps {
    vilkår: Vilkårdata[];
    risikovurdering?: Risikovurdering;
}

export const OppfylteVilkår = ({ vilkår }: OppfylteVilkårProps) => (
    <FlexColumn>
        <Vilkårstittel ikon={<GrøntSjekkikon />} størrelse="m">
            Vurderte vilkår
        </Vilkårstittel>
        {vilkår.map(({ tittel, paragraf, komponent }, i) => (
            <React.Fragment key={i}>
                <Vilkårstittel ikon={<Sjekkikon />} paragraf={paragraf}>
                    {tittel}
                </Vilkårstittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </FlexColumn>
);
