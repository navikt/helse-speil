import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import './Inntektskilder.less';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import Toppvarsel from '../../components/Toppvarsel';
import { useFørsteVedtaksperiode } from '../../hooks/useFørsteVedtaksperiode';
import dayjs from 'dayjs';

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 0.5rem 2rem;
    width: max-content;
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
            <Panel className="Inntektskilder tekstbolker">
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
            </Panel>
        </>
    );
};

export default Inntektskilder;
