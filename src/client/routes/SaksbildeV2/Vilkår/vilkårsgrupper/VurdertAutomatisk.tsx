import React from 'react';
import { Vilkårstittel } from '../Vilkårstittel';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { FlexColumn } from '../../../../components/Flex';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';

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
    <FlexColumn>
        <BehandletVarsel
            tittel="Vilkår vurdert for denne perioden"
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet
        >
            {vilkår.map(({ tittel, paragraf, komponent, paragrafIkon }, i) => (
                <VurdertTittel ikon={<Sjekkikon />} paragraf={paragraf} paragrafIkon={paragrafIkon} key={i}>
                    {tittel}
                </VurdertTittel>
            ))}
        </BehandletVarsel>
    </FlexColumn>
);
