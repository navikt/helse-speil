import React, { ReactNode, useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import Aktivitetsplikt from './Aktivitetsplikt';
import { Vilkårstype } from './vilkårsmapper';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';

export const GRUNNBELØP = 99858;

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

export interface Vilkårdata {
    oppfylt: boolean;
    type: Vilkårstype;
    komponent: ReactNode;
}

interface VilkårProps {
    vilkår: Vilkårdata[];
}

const filtrerBehandledeVilkår = (vilkår: Vilkårdata): boolean =>
    ![Vilkårstype.Opptjeningstid, Vilkårstype.KravTilSykepengegrunnlag].includes(vilkår.type);

const tilKomponent = (vilkår: Vilkårdata): ReactNode => vilkår.komponent;

const Vilkår = ({ vilkår }: VilkårProps) => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår || personTilBehandling === undefined) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    const ikkeOppfylteVilkår: Vilkårdata[] = vilkår.filter(it => !it.oppfylt);
    const oppfylteVilkår: Vilkårdata[] = vilkår.filter(it => it.oppfylt);

    const vedtaksperiodevisning = (periodestatus: VedtaksperiodeStatus): ReactNode => {
        switch (periodestatus) {
            case VedtaksperiodeStatus.Behandlet:
                return (
                    <BehandletVedtaksperiode
                        aktivVedtaksperiode={aktivVedtaksperiode}
                        førsteVedtaksperiode={førsteVedtaksperiode}
                    />
                );
            case VedtaksperiodeStatus.Ubehandlet:
                return (
                    <UbehandletVedtaksperiode
                        ikkeOppfylteVilkår={ikkeOppfylteVilkår.map(tilKomponent)}
                        oppfylteVilkår={oppfylteVilkår.map(tilKomponent)}
                    />
                );
            case VedtaksperiodeStatus.Påfølgende:
                return (
                    <PåfølgendeVedtaksperiode
                        førsteVedtaksperiode={førsteVedtaksperiode}
                        ikkeOppfylteVilkår={ikkeOppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                        oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    />
                );
        }
    };

    return (
        <>
            {periodeStatus && vedtaksperiodevisning(periodeStatus)}
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
