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

export const GRUNNBELØP = 99858;

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

interface VilkårProps {
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
}

const Vilkår = ({ ikkeOppfylteVilkår, oppfylteVilkår }: VilkårProps) => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår || personTilBehandling === undefined) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

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
                                    vilkår={ikkeOppfylteVilkår}
                                />
                            )}
                            <IkkeVurderteVilkår />
                            <Vilkårsvisning
                                tittel="Vurderte vilkår"
                                ikon={<GrøntSjekkikon />}
                                vilkår={oppfylteVilkår}
                            />
                        </>
                    ) : (
                        <>
                            <IkkeVurderteVilkår />
                            <PåfølgendeVedtaksperiode
                                aktivVedtaksperiode={aktivVedtaksperiode}
                                førsteVedtaksperiode={førsteVedtaksperiode}
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
