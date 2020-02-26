import React, { useContext } from 'react';
import { pages } from '../../hooks/useLinks';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import NavigationButtons from '../../components/NavigationButtons';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { useFørsteVedtaksperiode } from '../../hooks/useFørsteVedtaksperiode';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import dayjs from 'dayjs';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';

const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 2rem;
    width: max-content;
`;

const Sykepengegrunnlagpanel = styled.div`
    max-width: 1000px;
    margin: 0 2rem;
    width: max-content;
`;

const Sykepengegrunnlag = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();
    const førsteVedtaksperiode = useFørsteVedtaksperiode({ nåværendePeriode: aktivVedtaksperiode });
    const { t } = useTranslation();

    if (!aktivVedtaksperiode) return null;

    const førsteFraværsdag = dayjs(
        aktivVedtaksperiode.inngangsvilkår.dagerIgjen.førsteFraværsdag
    ).format('DD.MM.YYYY');
    const { sykepengegrunnlag } = aktivVedtaksperiode;
    return (
        <Sykepengegrunnlagpanel>
            {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
            ) : (
                <StyledBehandletInnhold
                    tittel={`Sykepengegrunnlag satt første sykdomsdag - ${førsteFraværsdag}`}
                    saksbehandler={førsteVedtaksperiode!.godkjentAv!}
                    vurderingsdato={førsteVedtaksperiode!.godkjentTidspunkt!}
                >
                    <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                </StyledBehandletInnhold>
            )}
            <NavigationButtons previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Sykepengegrunnlagpanel>
    );
};

export default Sykepengegrunnlag;
