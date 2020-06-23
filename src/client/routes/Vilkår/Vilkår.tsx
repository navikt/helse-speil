import React, { ReactNode, useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import { BehandletVedtaksperiode, BehandletVedtaksperiodeFraInfotrygd } from './BehandletVedtaksperiode';
import { PåfølgendeVedtaksperiode } from './PåfølgendeVedtaksperiode';
import { Førstegangsbehandling } from './UbehandletVedtaksperiode';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import Aktivitetsplikt from './Aktivitetsplikt';
import { Vilkårstype } from '../../context/mapping/vilkårsmapper';
import { Vedtaksperiode, Periodetype } from '../../context/types.internal';
import { useVilkår, VurderteVilkår } from '../../hooks/useVilkår';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

export interface Vilkårdata {
    oppfylt: boolean;
    type: Vilkårstype;
    komponent: ReactNode;
}

const filtrerBehandledeVilkår = (vilkår: Vilkårdata): boolean =>
    ![Vilkårstype.Opptjeningstid, Vilkårstype.KravTilSykepengegrunnlag].includes(vilkår.type);

const tilKomponent = (vilkår: Vilkårdata): ReactNode => vilkår.komponent;

interface VanligeVilkårProps {
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
    vilkår: VurderteVilkår;
}

const Vilkårsvisning = ({ aktivVedtaksperiode, førsteVedtaksperiode, vilkår }: VanligeVilkårProps) => {
    const { ikkeOppfylteVilkår, oppfylteVilkår, ikkeVurderteVilkår } = vilkår;
    if (aktivVedtaksperiode.behandlet) {
        return aktivVedtaksperiode.forlengelseFraInfotrygd ? (
            <BehandletVedtaksperiodeFraInfotrygd
                aktivVedtaksperiode={aktivVedtaksperiode}
                førsteVedtaksperiode={førsteVedtaksperiode}
            />
        ) : (
            <BehandletVedtaksperiode
                aktivVedtaksperiode={aktivVedtaksperiode}
                førsteVedtaksperiode={førsteVedtaksperiode}
            />
        );
    }
    switch (aktivVedtaksperiode.periodetype) {
        case Periodetype.Førstegangsbehandling:
            return (
                <Førstegangsbehandling
                    ikkeOppfylteVilkår={ikkeOppfylteVilkår.map(tilKomponent)}
                    oppfylteVilkår={oppfylteVilkår.map(tilKomponent)}
                    ikkeVurderteVilkår={ikkeVurderteVilkår}
                />
            );
        case Periodetype.Forlengelse:
            return (
                <PåfølgendeVedtaksperiode
                    førsteVedtaksperiode={førsteVedtaksperiode}
                    ikkeOppfylteVilkår={ikkeOppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    ikkeVurderteVilkår={ikkeVurderteVilkår}
                />
            );
        case Periodetype.Infotrygdforlengelse:
            return (
                <PåfølgendeVedtaksperiode
                    førsteVedtaksperiode={førsteVedtaksperiode}
                    ikkeOppfylteVilkår={ikkeOppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    ikkeVurderteVilkår={ikkeVurderteVilkår}
                    forlengelseFraInfotrygd={true}
                />
            );
    }
};

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const vilkår = useVilkår();

    if (!aktivVedtaksperiode || vilkår === undefined || personTilBehandling === undefined) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);
    return (
        <>
            <ErrorBoundary sidenavn="Vilkår">
                <Vilkårsvisning
                    vilkår={vilkår}
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
                <Aktivitetsplikt />
            </ErrorBoundary>
            <Footer />
        </>
    );
};

export default Vilkår;
