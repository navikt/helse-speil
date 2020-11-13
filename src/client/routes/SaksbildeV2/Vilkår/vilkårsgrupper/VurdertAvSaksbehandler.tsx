import React from 'react';
import styled from '@emotion/styled';
import { Vilkårstittel } from '../Vilkårstittel';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';

const VurdertTittel = styled(Vilkårstittel)`
    &:not(:last-of-type) {
        margin: 1rem 0;
    }
`;

interface VurdertAvSaksbehandlerProps {
    vilkår: Vilkårdata[];
    saksbehandler?: string;
    skjæringstidspunkt?: Dayjs;
}

export const VurdertAvSaksbehandler = ({ vilkår, skjæringstidspunkt, saksbehandler }: VurdertAvSaksbehandlerProps) => {
    const tittel = skjæringstidspunkt
        ? `Vilkår vurdert ved skjæringstidspunkt - ${skjæringstidspunkt.format(NORSK_DATOFORMAT)}`
        : 'Vilkår vurdert denne perioden';
    return (
        <Vilkårkolonne data-testid="vurdert-av-saksbehandler">
            <BehandletVarsel tittel={tittel} saksbehandler={saksbehandler ?? 'Ukjent'} automatiskBehandlet={false}>
                {vilkår.map(({ tittel, paragraf, paragrafIkon, komponent, type }, i) => (
                    <React.Fragment key={i}>
                        <VurdertTittel type={type} ikon={<Sjekkikon />} paragraf={paragraf} paragrafIkon={paragrafIkon}>
                            {tittel}
                        </VurdertTittel>
                        {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                    </React.Fragment>
                ))}
            </BehandletVarsel>
        </Vilkårkolonne>
    );
};
