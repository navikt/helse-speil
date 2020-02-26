import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import { useFørsteVedtaksperiode } from '../../hooks/useFørsteVedtaksperiode';
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
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();
    const { t } = useTranslation();

    const førsteVedtaksperiode = useFørsteVedtaksperiode({ nåværendePeriode: aktivVedtaksperiode });
    if (!aktivVedtaksperiode) return null;
    const førsteFraværsdag = dayjs(
        aktivVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
    ).format('DD.MM.YYYY');

    const { godkjentAv, fom, inntektskilder } = aktivVedtaksperiode;

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
                <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
            </Inntektskilderpanel>
        </>
    );
};

export default Inntektskilder;
