import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import './Inngangsvilkår.less';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { pages } from '../../hooks/useLinks';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Toppvarsel from '../../components/Toppvarsel';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Inngangsvilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.inngangsvilkår) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(
        aktivVedtaksperiode,
        personTilBehandling!
    );

    return (
        <>
            <Toppvarsel text="Enkelte inngangsvilkår må vurderes manuelt" type="advarsel" />
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
            <Footer previous={pages.SYKMELDINGSPERIODE} next={pages.INNTEKTSKILDER} />
        </>
    );
};

export default Inngangsvilkår;
