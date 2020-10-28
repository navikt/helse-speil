import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import SykepengegrunnlagInfotrygd from './SykepengegrunnlagInfotrygd';
import { Periodetype, Vedtaksperiode } from 'internal-types';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import Inntektskilderinnhold from './Inntektskilderinnhold';

const StyledBehandletInnhold = styled(BehandletVarsel)`
    margin: 2rem 2rem;
    width: max-content;
`;

const StyledBehandletAvInfotrygd = styled(BehandletAvInfotrygd)`
    margin: 2rem 2rem;
    width: max-content;
`;

const Sykepengegrunnlagpanel = styled.div`
    max-width: 1265px;
    margin: 0 2rem;
    width: max-content;
`;

const OversiktContainer = styled.div`
    display: flex;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 2px solid #c6c2bf;
    height: max-content;
    display: inline-block;
    margin-left: 5rem;
    margin-right: 2rem;
`;

const Oversikt = ({ aktivVedtaksperiode }: { aktivVedtaksperiode: Vedtaksperiode }) => (
    <OversiktContainer>
        <Sykepengegrunnlaginnhold sykepengegrunnlag={aktivVedtaksperiode.sykepengegrunnlag} />
        <Strek />
        <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
    </OversiktContainer>
);

export const Sykepengegrunnlag = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førstePeriode = førsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { sykepengegrunnlag, periodetype } = aktivVedtaksperiode;

    const Innhold = () =>
        periodetype === Periodetype.Førstegangsbehandling ? (
            <Oversikt aktivVedtaksperiode={aktivVedtaksperiode} />
        ) : periodetype === Periodetype.Infotrygdforlengelse ? (
            <OversiktContainer>
                <StyledBehandletAvInfotrygd tittel={`Sykepengegrunnlag satt i Infotrygd`}>
                    <SykepengegrunnlagInfotrygd
                        årsinntektFraInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding}
                    />
                </StyledBehandletAvInfotrygd>
                <Strek />
                <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
            </OversiktContainer>
        ) : (
            <StyledBehandletInnhold
                tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
                saksbehandler={førstePeriode?.godkjentAv!}
                vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                automatiskBehandlet={førstePeriode.automatiskBehandlet}
            >
                <Oversikt aktivVedtaksperiode={aktivVedtaksperiode} />
            </StyledBehandletInnhold>
        );

    return (
        <Sykepengegrunnlagpanel>
            <AgurkErrorBoundary>
                <Innhold />
            </AgurkErrorBoundary>
        </Sykepengegrunnlagpanel>
    );
};
