import React from 'react';

import { Vilkårdata } from '../../../../mapping/vilkår';
import { tilNorskDato } from '../../../../utils/date';

import { BehandletVarselContent, Vilkårgrid, Vilkårgruppe } from '../Vilkår.styles';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Saksbehandlervurdering } from '../../../../components/Saksbehandlervurdering';
import { AutomatiskVurdering } from '../../../../components/AutomatiskVurdering';

const Vilkår = ({ tittel, paragraf, komponent, type }: Vilkårdata) => (
    <Vilkårgruppe>
        <Vilkårsgruppetittel type={type} oppfylt={true} paragraf={paragraf}>
            {tittel}
        </Vilkårsgruppetittel>
        {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
    </Vilkårgruppe>
);

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

    return automatiskBehandlet ? (
        <AutomatiskVurdering title={tittel} ident={ident}>
            <BehandletVarselContent data-testid="vurdert-automatisk" aria-label="Vilkår vurdert automatisk">
                {vilkår.map((props, i) => (
                    <Vilkår key={i} {...props} />
                ))}
            </BehandletVarselContent>
        </AutomatiskVurdering>
    ) : (
        <Saksbehandlervurdering title={tittel} ident={ident}>
            <BehandletVarselContent data-testid="vurdert-av-saksbehandler" aria-label="Vilkår vurdert av saksbehandler">
                {vilkår.map((props, i) => (
                    <Vilkår key={i} {...props} />
                ))}
            </BehandletVarselContent>
        </Saksbehandlervurdering>
    );
};
