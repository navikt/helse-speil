import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import NavigationButtons from '../../components/NavigationButtons';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import Sykepengegrunnlaginnhold from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../utils/date';

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
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode || !personTilBehandling) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling);
    const førsteFraværsdag = aktivVedtaksperiode.vilkår?.dagerIgjen?.førsteFraværsdag
        ? aktivVedtaksperiode.vilkår.dagerIgjen.førsteFraværsdag.format(NORSK_DATOFORMAT)
        : 'Ukjent dato';

    const { sykepengegrunnlag } = aktivVedtaksperiode;

    return (
        <Sykepengegrunnlagpanel>
            {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
            ) : (
                <StyledBehandletInnhold
                    tittel={`Sykepengegrunnlag satt første sykdomsdag - ${førsteFraværsdag}`}
                    saksbehandler={førsteVedtaksperiode?.godkjentAv!}
                    vurderingsdato={førsteVedtaksperiode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
                >
                    <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
                </StyledBehandletInnhold>
            )}
            <NavigationButtons />
        </Sykepengegrunnlagpanel>
    );
};

export default Sykepengegrunnlag;
