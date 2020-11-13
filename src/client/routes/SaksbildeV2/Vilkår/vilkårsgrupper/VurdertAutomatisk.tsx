import React from 'react';
import styled from '@emotion/styled';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Vilkårstittel } from '../Vilkårstittel';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';

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
    <Vilkårkolonne data-testid="vurdert-automatisk">
        <BehandletVarsel
            tittel="Vilkår vurdert for denne perioden"
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet
        >
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <React.Fragment key={i}>
                    <VurdertTittel type={type} ikon={<Sjekkikon />} paragraf={paragraf}>
                        {tittel}
                    </VurdertTittel>
                    {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                </React.Fragment>
            ))}
        </BehandletVarsel>
    </Vilkårkolonne>
);
