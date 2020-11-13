import React from 'react';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { BehandletInnholdContainer, Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';

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
            <BehandletInnholdContainer
                tittel={tittel}
                saksbehandler={saksbehandler ?? 'Ukjent'}
                automatiskBehandlet={false}
            >
                {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                    <React.Fragment key={i}>
                        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                            {tittel}
                        </Vilkårsgruppetittel>
                        {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                    </React.Fragment>
                ))}
            </BehandletInnholdContainer>
        </Vilkårkolonne>
    );
};
