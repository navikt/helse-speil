import React, { useContext } from 'react';
import { Navigasjonsknapper } from '../../../components/Navigasjonsknapper';
import { PersonContext } from '../../../context/PersonContext';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Periodetype } from 'internal-types';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

const StyledBehandletInnhold = styled(BehandletVarsel)`
    margin: 2rem 2rem;
    width: max-content;
`;

const Inntektskilderpanel = styled.div`
    max-width: 1000px;
    margin: 0 2rem;
    min-width: max-content;
`;

const Inntektskilder = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodetype = aktivVedtaksperiode?.periodetype;

    if (aktivVedtaksperiode === undefined || personTilBehandling === undefined) return null;

    const førstePeriode = førsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const førsteFraværsdag = aktivVedtaksperiode.vilkår?.dagerIgjen?.førsteFraværsdag
        ? aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    return (
        <Inntektskilderpanel>
            <ErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling ? (
                    <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
                ) : (
                    <StyledBehandletInnhold
                        tittel={`Inntekt vurdert første sykdomsdag - ${førsteFraværsdag}`}
                        saksbehandler={førstePeriode?.godkjentAv}
                        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                        automatiskBehandlet={førstePeriode.automatiskBehandlet}
                    >
                        <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
                    </StyledBehandletInnhold>
                )}
            </ErrorBoundary>
            <Navigasjonsknapper />
        </Inntektskilderpanel>
    );
};

export default Inntektskilder;
