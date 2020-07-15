import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';
import NavigationButtons from '../../../components/NavigationButtons';
import { finnFørsteVedtaksperiode } from '../../../hooks/finnFørsteVedtaksperiode';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import SykepengegrunnlagInfotrygd from './SykepengegrunnlagInfotrygd';
import { Periodetype } from '../../../context/types.internal';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 2rem;
    width: max-content;
`;

const StyledBehandletAvInfotrygd = styled(BehandletAvInfotrygd)`
    margin: 2rem 2rem;
    width: max-content;
`;

const Sykepengegrunnlagpanel = styled.div`
    max-width: 1000px;
    margin: 0 2rem;
    width: max-content;
`;

const Sykepengegrunnlag = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const førsteFraværsdag = aktivVedtaksperiode.vilkår?.dagerIgjen?.førsteFraværsdag
        ? aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { sykepengegrunnlag, periodetype } = aktivVedtaksperiode;

    return (
        <Sykepengegrunnlagpanel>
            <ErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling ? (
                    <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                ) : periodetype === Periodetype.Infotrygdforlengelse ? (
                    <StyledBehandletAvInfotrygd tittel={`Sykepengegrunnlag satt i Infotrygd`}>
                        <SykepengegrunnlagInfotrygd
                            årsinntektFraInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding}
                        />
                    </StyledBehandletAvInfotrygd>
                ) : (
                    <StyledBehandletInnhold
                        tittel={`Sykepengegrunnlag satt første sykdomsdag - ${førsteFraværsdag}`}
                        saksbehandler={førsteVedtaksperiode?.godkjentAv!}
                        vurderingsdato={førsteVedtaksperiode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                    >
                        <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                    </StyledBehandletInnhold>
                )}
            </ErrorBoundary>
            <NavigationButtons />
        </Sykepengegrunnlagpanel>
    );
};

export default Sykepengegrunnlag;
