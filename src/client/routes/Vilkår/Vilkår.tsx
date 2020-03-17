import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Toppvarsel from '../../components/Toppvarsel';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import { StyledIkkeVurderteVilkår } from './Vilkår.styles';
import IkkeVurderteVilkår from './IkkeVurderteVilkår';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    return (
        <>
            <Toppvarsel text="Enkelte vilkår må vurderes manuelt" type="advarsel" />
            <IkkeVurderteVilkår />
            {periodeStatus === VedtaksperiodeStatus.Behandlet ? (
                <BehandletVedtaksperiode
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            ) : periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                <UbehandletVedtaksperiode aktivVedtaksperiode={aktivVedtaksperiode} />
            ) : (
                <PåfølgendeVedtaksperiode
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            )}
            <Footer />
        </>
    );
};

export default Vilkår;
