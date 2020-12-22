import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../../context/PersonContext';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import { Sykepengegrunnlaginnhold } from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import {
    Inntektsgrunnlag,
    Inntektskilde,
    Periodetype,
    Sykepengegrunnlag as Sykepengegrunnlagtype,
} from 'internal-types';
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

interface OversiktForInfotrygdProps {
    årsinntektFraInntektsmelding: number;
    inntektskilder: Inntektskilde[];
}

const OversiktForInfotrygd = ({ årsinntektFraInntektsmelding, inntektskilder }: OversiktForInfotrygdProps) => (
    <OversiktContainer>
        <Inntektskilderinnhold inntektskilder={inntektskilder} />
        <Strek />
        <SykepengegrunnlagInfotrygd årsinntektFraInntektsmelding={årsinntektFraInntektsmelding} />
    </OversiktContainer>
);

interface OversiktProps {
    inntektskilder: Inntektskilde[];
    sykepengegrunnlag: Sykepengegrunnlagtype;
    inntektsgrunnlag?: Inntektsgrunnlag;
}

const Oversikt = ({ inntektsgrunnlag, inntektskilder, sykepengegrunnlag }: OversiktProps) => (
    <OversiktContainer>
        <Inntektskilderinnhold inntektskilder={inntektskilder} />
        <Strek />
        {inntektsgrunnlag ? (
            <Inntektsgrunnlaginnhold inntektsgrunnlag={inntektsgrunnlag} />
        ) : (
            <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
        )}
    </OversiktContainer>
);

export const Sykepengegrunnlag = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førstePeriode = førsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { periodetype, inntektsgrunnlag, inntektskilder, sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <Sykepengegrunnlagpanel>
            <AgurkErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling ? (
                    <Oversikt
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilder={inntektskilder}
                        sykepengegrunnlag={sykepengegrunnlag}
                    />
                ) : periodetype === Periodetype.Infotrygdforlengelse ? (
                    <StyledBehandletAvInfotrygd tittel={`Sykepengegrunnlag satt i Infotrygd`}>
                        <OversiktForInfotrygd
                            årsinntektFraInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                            inntektskilder={aktivVedtaksperiode.inntektskilder}
                        />
                    </StyledBehandletAvInfotrygd>
                ) : (
                    <StyledBehandletInnhold
                        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
                        saksbehandler={førstePeriode?.godkjentAv!}
                        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                        automatiskBehandlet={førstePeriode.automatiskBehandlet}
                    >
                        <Oversikt
                            inntektsgrunnlag={inntektsgrunnlag}
                            inntektskilder={inntektskilder}
                            sykepengegrunnlag={sykepengegrunnlag}
                        />
                    </StyledBehandletInnhold>
                )}
            </AgurkErrorBoundary>
        </Sykepengegrunnlagpanel>
    );
};
