import React from 'react';
import styled from '@emotion/styled';
import { Vilkårstittel } from '../Vilkårstittel';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { FlexColumn } from '../../../../components/Flex';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

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

export const VurdertAvSaksbehandler = ({ vilkår, skjæringstidspunkt, saksbehandler }: VurdertAvSaksbehandlerProps) => (
    <FlexColumn>
        <BehandletVarsel
            tittel={`Vilkår vurdert ved skjæringstidspunkt - ${
                skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent'
            }`}
            saksbehandler={saksbehandler ?? 'Ukjent'}
            automatiskBehandlet={false}
        >
            {vilkår.map(({ tittel, paragraf, komponent }, i) => (
                <VurdertTittel ikon={<Sjekkikon />} paragraf={paragraf} key={i}>
                    {tittel}
                </VurdertTittel>
            ))}
        </BehandletVarsel>
    </FlexColumn>
);
