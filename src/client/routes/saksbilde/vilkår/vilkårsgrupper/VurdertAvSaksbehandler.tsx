import { Dayjs } from 'dayjs';
import React from 'react';

import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { BehandletVarselContent, Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';

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
                <BehandletVarselContent>
                    {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                        <React.Fragment key={i}>
                            <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                                {tittel}
                            </Vilkårsgruppetittel>
                            <Vilkårgrid>{komponent}</Vilkårgrid>
                        </React.Fragment>
                    ))}
                </BehandletVarselContent>
            </BehandletVarsel>
        </Vilkårkolonne>
    );
};
