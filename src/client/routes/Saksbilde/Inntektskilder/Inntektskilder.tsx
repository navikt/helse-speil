import React, { useContext } from 'react';
import { Navigasjonsknapper } from '../../../components/Navigasjonsknapper';
import { PersonContext } from '../../../context/PersonContext';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Periodetype } from 'internal-types';
import { førsteVedtaksperiode } from '../../../mapping/selectors';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';

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
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen?.skjæringstidspunkt
        ? aktivVedtaksperiode.vilkår.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    return (
        <Inntektskilderpanel>
            <AgurkErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling ? (
                    <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
                ) : (
                    <StyledBehandletInnhold
                        tittel={`Inntekt vurdert ved skjæringstidspunkt - ${skjæringstidspunkt}`}
                        saksbehandler={førstePeriode?.godkjentAv}
                        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                        automatiskBehandlet={førstePeriode.automatiskBehandlet}
                    >
                        <Inntektskilderinnhold inntektskilder={aktivVedtaksperiode.inntektskilder} />
                    </StyledBehandletInnhold>
                )}
            </AgurkErrorBoundary>
            <Navigasjonsknapper />
        </Inntektskilderpanel>
    );
};

export default Inntektskilder;
