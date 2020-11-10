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
    <FlexColumn data-testid="oppfylte-vilkår">
        <Vilkårstittel ikon={<GrøntSjekkikon />} størrelse="m">
            Vurderte vilkår
        </Vilkårstittel>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <React.Fragment key={i}>
                <Vilkårstittel type={type} ikon={<Sjekkikon />} paragraf={paragraf}>
                    {tittel}
                </Vilkårstittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </FlexColumn>
);
