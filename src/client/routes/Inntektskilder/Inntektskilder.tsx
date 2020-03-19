import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import Toppvarsel from '../../components/Toppvarsel';
import { NORSK_DATOFORMAT } from '../../utils/date';

const StyledBehandletInnhold = styled(BehandletInnhold)`
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
    const periodeStatus = useVedtaksperiodestatus();

    if (aktivVedtaksperiode === undefined || personTilBehandling === undefined) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const førsteFraværsdag = aktivVedtaksperiode.vilkår.dagerIgjen?.førsteFraværsdag
        ? aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { inntektskilder } = aktivVedtaksperiode;

    return (
        <>
            <Toppvarsel text="Enkelte inntektskilder må sjekkes manuelt" type="advarsel" />
            <Inntektskilderpanel>
                {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                    <Inntektskilderinnhold inntektskilder={inntektskilder} />
                ) : (
                    <StyledBehandletInnhold
                        tittel={`Inntekt vurdert første sykdomsdag - ${førsteFraværsdag}`}
                        saksbehandler={førsteVedtaksperiode?.godkjentAv!}
                        vurderingsdato={førsteVedtaksperiode?.godkjentTidspunkt?.format(NORSK_DATOFORMAT)}
                    >
                        <Inntektskilderinnhold inntektskilder={inntektskilder} />
                    </StyledBehandletInnhold>
                )}
                <NavigationButtons />
            </Inntektskilderpanel>
        </>
    );
};

export default Inntektskilder;
