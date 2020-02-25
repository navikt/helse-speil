import React, { useContext, useState } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import './Inngangsvilkår.less';
import VisDetaljerKnapp from '../../components/VisDetaljerKnapp';
import styled from '@emotion/styled';
import Grid from '../../components/Grid';
import Varsel from '@navikt/helse-frontend-varsel';
import { Vedtaksperiode } from '../../context/types';
import { AuthContext } from '../../context/AuthContext';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { pages } from '../../hooks/useLinks';

const Toppvarsel = styled(Varsel)`
    border-radius: 0;
`;

const Container = styled(Grid)`
    margin: 0 2rem;
`;

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

enum VedtaksperiodeStatus {
    Ubehandlet = 'ubehandlet',
    Påfølgende = 'påfølgende',
    Behandlet = 'behandlet'
}

const status = (vedtaksperiode: Vedtaksperiode) => {
    const erFørstePeriode =
        vedtaksperiode.rawData.førsteFraværsdag === vedtaksperiode.sykdomstidslinje[0].dagen;
    const erGodkjent =
        vedtaksperiode.rawData.godkjentAv !== null &&
        vedtaksperiode.rawData.godkjentAv !== undefined;

    if (erGodkjent) {
        return VedtaksperiodeStatus.Behandlet;
    } else if (erFørstePeriode) {
        return VedtaksperiodeStatus.Ubehandlet;
    } else {
        return VedtaksperiodeStatus.Påfølgende;
    }
};

const Inngangsvilkår = () => {
    const { authInfo } = useContext(AuthContext);
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const [visDetaljerModal, setVisDetaljerModal] = useState(false);
    const detaljerKnapp = <VisDetaljerKnapp onClick={() => setVisDetaljerModal(true)} />;

    if (!aktivVedtaksperiode?.inngangsvilkår) return null;

    const { inngangsvilkår, sykepengegrunnlag } = aktivVedtaksperiode;
    const periodeStatus = status(aktivVedtaksperiode);

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
