import React, { ReactNode, useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import IkkeVurderteVilkår from './Vilkårsgrupper/IkkeVurderteVilkår';
import Aktivitetsplikt from './Aktivitetsplikt';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import { Vilkårstype } from './vilkårsmapper';

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

    const ikkeOppfylteVilkår = vilkår.filter(vilkår => !vilkår.oppfylt);
    const oppfylteVilkår = vilkår.filter(vilkår => vilkår.oppfylt);

    return (
        <>
            {periodeStatus === VedtaksperiodeStatus.Behandlet && (
                <BehandletVedtaksperiode
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            )}
            {periodeStatus !== VedtaksperiodeStatus.Behandlet && (
                <>
                    <Varsel type={Varseltype.Advarsel}>Enkelte vilkår må vurderes manuelt</Varsel>
                    {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                        <>
                            {ikkeOppfylteVilkår.length > 0 && (
                                <Vilkårsvisning
                                    tittel="Ikke oppfylte vilkår"
                                    ikon={<Feilikon />}
                                    vilkår={ikkeOppfylteVilkår.map(tilKomponent)}
                                />
                            )}
                            <IkkeVurderteVilkår />
                            <Vilkårsvisning
                                tittel="Vurderte vilkår"
                                ikon={<GrøntSjekkikon />}
                                vilkår={oppfylteVilkår.map(tilKomponent)}
                            />
                        </>
                    ) : (
                        <>
                            <PåfølgendeVedtaksperiode
                                førsteVedtaksperiode={førsteVedtaksperiode}
                                ikkeOppfylteVilkår={ikkeOppfylteVilkår
                                    .filter(filtrerBehandledeVilkår)
                                    .map(tilKomponent)}
                                oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                            />
                        </>
                    )}
                </>
            )}
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
