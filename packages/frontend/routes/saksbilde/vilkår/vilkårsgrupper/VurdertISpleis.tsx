import React from 'react';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { tilNorskDato } from '../../../../utils/date';

import { BehandletVarselContent, StyledBehandletVarsel, Vilkårgrid, Vilkårgruppe } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';

interface VurdertISpleisProps {
    vilkår: Vilkårdata[];
    ident: string;
    skjæringstidspunkt: string;
    automatiskBehandlet: boolean;
    erForlengelse: boolean;
}

export const VurdertISpleis = ({
    vilkår,
    ident,
    skjæringstidspunkt,
    automatiskBehandlet,
    erForlengelse,
}: VurdertISpleisProps) => {
    const tittel = erForlengelse
        ? `Vilkår vurdert ved skjæringstidspunkt - ${tilNorskDato(skjæringstidspunkt)}`
        : 'Vilkår vurdert denne perioden';

    const testId = automatiskBehandlet ? 'vurdert-automatisk' : 'vurdert-av-saksbehandler';

    const ariaLabel = automatiskBehandlet ? 'Vilkår vurdert automatisk' : 'Vilkår vurdert av saksbehandler';

    return (
        <StyledBehandletVarsel tittel={tittel} saksbehandler={ident} automatiskBehandlet={automatiskBehandlet}>
            <BehandletVarselContent data-testid={testId} aria-label={ariaLabel}>
                {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                    <Vilkårgruppe key={i}>
                        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
                            {tittel}
                        </Vilkårsgruppetittel>
                        {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
                    </Vilkårgruppe>
                ))}
            </BehandletVarselContent>
        </StyledBehandletVarsel>
    );
};
