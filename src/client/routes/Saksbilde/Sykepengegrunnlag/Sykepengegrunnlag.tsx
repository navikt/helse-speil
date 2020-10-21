import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';
import { Navigasjonsknapper } from '../../../components/Navigasjonsknapper';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import SykepengegrunnlagInfotrygd from './SykepengegrunnlagInfotrygd';
import { Periodetype } from 'internal-types';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';

const StyledBehandletInnhold = styled(BehandletVarsel)`
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

    const førstePeriode = førsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { sykepengegrunnlag, periodetype } = aktivVedtaksperiode;

    return (
        <Sykepengegrunnlagpanel>
            <AgurkErrorBoundary>
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
                        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
                        saksbehandler={førstePeriode?.godkjentAv!}
                        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                        automatiskBehandlet={førstePeriode.automatiskBehandlet}
                    >
                        <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                    </StyledBehandletInnhold>
                )}
            </AgurkErrorBoundary>
            <Navigasjonsknapper />
        </Sykepengegrunnlagpanel>
    );
};

export default Sykepengegrunnlag;
