import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import dayjs from 'dayjs';
import Toppvarsel from '../../components/Toppvarsel';

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
    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const førsteFraværsdag = dayjs(aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag).format('DD.MM.YYYY');

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
                        saksbehandler={førsteVedtaksperiode!.godkjentAv!}
                        vurderingsdato={førsteVedtaksperiode!.godkjentTidspunkt!}
                    >
                        <Inntektskilderinnhold inntektskilder={inntektskilder} />
                    </StyledBehandletInnhold>
                )}
                <NavigationButtons previous={pages.VILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
            </Inntektskilderpanel>
        </>
    );
};

export default Inntektskilder;
