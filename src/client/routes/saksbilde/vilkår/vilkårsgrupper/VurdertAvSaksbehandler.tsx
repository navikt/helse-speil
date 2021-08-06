import { Dayjs } from 'dayjs';
import React from 'react';

import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { BehandletVarselContent, Vilkårgrid, Vilkårgruppe } from '../Vilkår.styles';
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
        <BehandletVarsel tittel={tittel} saksbehandler={saksbehandler ?? 'Ukjent'} automatiskBehandlet={false}>
            <BehandletVarselContent data-testid="vurdert-av-saksbehandler" aria-label="Vilkår vurdert av saksbehandler">
                {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                    <Vilkårgruppe key={i}>
                        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                            {tittel}
                        </Vilkårsgruppetittel>
                        {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                    </Vilkårgruppe>
                ))}
            </BehandletVarselContent>
        </BehandletVarsel>
    );
};
