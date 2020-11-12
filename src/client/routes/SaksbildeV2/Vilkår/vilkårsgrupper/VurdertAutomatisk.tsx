import React from 'react';
import { Vilkårstittel } from '../Vilkårstittel';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { FlexColumn } from '../../../../components/Flex';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import { Vilkårgrid } from '../Vilkår.styles';

const VurdertTittel = styled(Vilkårstittel)`
    &:not(:last-of-type) {
        margin: 1rem 0;
    }
`;

interface VurdertAutomatiskProps {
    vilkår: Vilkårdata[];
    saksbehandler?: string;
}

export const VurdertAutomatisk = ({ vilkår, saksbehandler }: VurdertAutomatiskProps) => (
    <FlexColumn data-testid="vurdert-automatisk">
        <BehandletVarsel
            tittel="Vilkår vurdert for denne perioden"
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet
        >
            {vilkår.map(({ tittel, paragraf, komponent, paragrafIkon, type }, i) => (
                <React.Fragment key={i}>
                    <VurdertTittel type={type} ikon={<Sjekkikon />} paragraf={paragraf} paragrafIkon={paragrafIkon}>
                        {tittel}
                    </VurdertTittel>
                    {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                </React.Fragment>
            ))}
        </BehandletVarsel>
    </FlexColumn>
);
