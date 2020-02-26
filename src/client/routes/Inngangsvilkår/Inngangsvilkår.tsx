import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import './Inngangsvilkår.less';
import styled from '@emotion/styled';
import Grid from '../../components/Grid';
import { AuthContext } from '../../context/AuthContext';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { pages } from '../../hooks/useLinks';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Toppvarsel from '../../components/Toppvarsel';

const Container = styled(Grid)`
    margin: 0 2rem;
`;

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Inngangsvilkår = () => {
    const { authInfo } = useContext(AuthContext);
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.inngangsvilkår) return null;
    const { inngangsvilkår, sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <>
            <Toppvarsel text="Enkelte inngangsvilkår må vurderes manuelt" type="advarsel" />
            {periodeStatus === VedtaksperiodeStatus.Behandlet ? (
                <BehandletVedtaksperiode vedtaksperiode={aktivVedtaksperiode} />
            ) : periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                <UbehandletVedtaksperiode vedtaksperiode={aktivVedtaksperiode} />
            ) : (
                <PåfølgendeVedtaksperiode vedtaksperiode={aktivVedtaksperiode} />
            )}
            <Footer previous={pages.SYKMELDINGSPERIODE} next={pages.INNTEKTSKILDER} />
        </>
    );
};

export default Inngangsvilkår;
