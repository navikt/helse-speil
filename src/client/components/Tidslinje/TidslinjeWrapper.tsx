import Tidslinje from '@navikt/helse-frontend-tidslinje';
import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { EnkelTidslinje, VedtaksperiodeStatus } from '@navikt/helse-frontend-tidslinje/dist/types';
import { PersonContext } from '../../context/PersonContext';
import { VedtaksperiodeTilstand } from '../../../types';

const Container = styled.div`
    padding: 1rem 2rem 0;
    border-bottom: 1px solid #c6c2bf;
`;

const periodeStatus = (tilstand: VedtaksperiodeTilstand) => {
    switch (tilstand) {
        case VedtaksperiodeTilstand.AVVENTER_GODKJENNING:
            return VedtaksperiodeStatus.Oppgaver;
        case VedtaksperiodeTilstand.TIL_UTBETALING:
            return VedtaksperiodeStatus.TilUtbetaling;
        case VedtaksperiodeTilstand.START:
        case VedtaksperiodeTilstand.MOTTATT_NY_SØKNAD:
        case VedtaksperiodeTilstand.AVVENTER_SENDT_SØKNAD:
        case VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE_ELLER_INNTEKTSMELDING:
        case VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE:
        case VedtaksperiodeTilstand.UNDERSØKER_HISTORIKK:
        case VedtaksperiodeTilstand.AVVENTER_INNTEKTSMELDING:
        case VedtaksperiodeTilstand.AVVENTER_VILKÅRSPRØVING:
        case VedtaksperiodeTilstand.AVVENTER_HISTORIKK:
        case VedtaksperiodeTilstand.TIL_INFOTRYGD:
            return VedtaksperiodeStatus.Venter;
    }
};

const TidslinjeWrapper = () => {
    const { personTilBehandling, aktiverVedtaksperiode } = useContext(PersonContext);

    const tidslinjer = personTilBehandling?.arbeidsgivere.map(arbeidsgiver => ({
        id: arbeidsgiver.id,
        inntektsnavn: '',
        inntektstype: 'arbeidsgiver',
        vedtaksperioder: arbeidsgiver.vedtaksperioder.map(periode => ({
            id: periode.id,
            fom: periode.fom,
            tom: periode.tom,
            status: periodeStatus(periode.tilstand)
        }))
    }));

    if (!tidslinjer) return null;

    return (
        <Container>
            <Tidslinje
                tidslinjer={tidslinjer as EnkelTidslinje[]}
                onSelect={periode => aktiverVedtaksperiode(periode!.id)}
            />
        </Container>
    );
};

export default TidslinjeWrapper;
