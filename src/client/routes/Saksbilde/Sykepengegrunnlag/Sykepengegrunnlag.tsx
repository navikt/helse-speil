import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Periodetype, Vedtaksperiode } from 'internal-types';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import Inntektsgrunnlaginnhold from './Inntektsgrunnlaginnhold';
import SykepengegrunnlagInfotrygd from './SykepengegrunnlagInfotrygd';

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
    width: max-content;
    margin-top: 2rem;
`;

const OversiktContainer = styled.div`
    display: flex;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 1px solid #c6c2bf;
    height: inherit;
    display: inline-block;
    margin-left: 5rem;
    margin-right: 2rem;
`;

const Oversikt = ({ aktivVedtaksperiode }: { aktivVedtaksperiode: Vedtaksperiode }) => {
    const { inntektsgrunnlag, inntektskilder, sykepengegrunnlag } = aktivVedtaksperiode;
    if (inntektsgrunnlag)
        return (
            <OversiktContainer>
                <Inntektsgrunnlaginnhold inntektsgrunnlag={inntektsgrunnlag} />
                <Strek />
                <Inntektskilderinnhold inntektskilder={inntektskilder} />
            </OversiktContainer>
        );
    else
        return (
            <OversiktContainer>
                {aktivVedtaksperiode.periodetype === Periodetype.Infotrygdforlengelse ? (
                    <SykepengegrunnlagInfotrygd
                        årsinntektFraInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding}
                    />
                ) : (
                    <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                )}
                <Strek />
                <Inntektskilderinnhold inntektskilder={inntektskilder} />
            </OversiktContainer>
        );
};

export const Sykepengegrunnlag = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førstePeriode = førsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { periodetype } = aktivVedtaksperiode;

    const Innhold = () =>
        periodetype === Periodetype.Førstegangsbehandling ? (
            <Oversikt aktivVedtaksperiode={aktivVedtaksperiode} />
        ) : periodetype === Periodetype.Infotrygdforlengelse ? (
            <StyledBehandletAvInfotrygd tittel={`Sykepengegrunnlag satt i Infotrygd`}>
                <Oversikt aktivVedtaksperiode={aktivVedtaksperiode} />
            </StyledBehandletAvInfotrygd>
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
