import React, { useContext } from 'react';
import Tidslinje, {
    EnkelTidslinje,
    Vedtaksperiode,
    VedtaksperiodeStatus
} from '@navikt/helse-frontend-tidslinje';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { VedtaksperiodeTilstand } from '../../../types';

const Container = styled.div`
    padding: 1rem 2rem 0;
    border-bottom: 1px solid #c6c2bf;
`;

const periodeStatus = (
    tilstand: VedtaksperiodeTilstand
): VedtaksperiodeStatus | VedtaksperiodeTilstand => {
    switch (tilstand) {
        case VedtaksperiodeTilstand.UTBETALT:
        case VedtaksperiodeTilstand.AVSLUTTET:
            return VedtaksperiodeStatus.Utbetalt;
        case VedtaksperiodeTilstand.AVVENTER_GODKJENNING:
            return VedtaksperiodeStatus.Oppgaver;
        case VedtaksperiodeTilstand.TIL_UTBETALING:
            return VedtaksperiodeStatus.TilUtbetaling;
        case VedtaksperiodeTilstand.UTBETALING_FEILET:
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
        case VedtaksperiodeTilstand.ANNULLERT:
            return VedtaksperiodeStatus.Avslag;
        default:
            return tilstand;
    }
};

interface Intervall {
    id: string;
    fom: string;
    tom: string;
    status: VedtaksperiodeStatus;
}

const TidslinjeWrapper = () => {
    const { personTilBehandling, aktiverVedtaksperiode } = useContext(PersonContext);

    const tidslinjer: EnkelTidslinje[] | undefined = personTilBehandling?.arbeidsgivere.map(
        arbeidsgiver => ({
            id: arbeidsgiver.id,
            inntektsnavn: arbeidsgiver.organisasjonsnummer,
            inntektstype: 'arbeidsgiver',
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(periode => ({
                id: periode.id,
                fom: periode.fom,
                tom: periode.tom,
                status: periodeStatus(periode.tilstand) as VedtaksperiodeStatus,
                disabled: !periode.kanVelges
            }))
        })
    );

    const vedtaksperiodeForIntervall = (intervall: Intervall) => {
        return tidslinjer
            ?.reduce(
                (perioder: Vedtaksperiode[], tidslinje) =>
                    perioder.concat(tidslinje.vedtaksperioder),
                []
            )
            .find(periode => periode.fom === intervall.fom);
    };

    const onSelect = (intervall: Intervall) => {
        const periode = vedtaksperiodeForIntervall(intervall);
        aktiverVedtaksperiode(periode!.id);
    };

    if (!tidslinjer) return null;

    return (
        <Container>
            <Tidslinje tidslinjer={tidslinjer as EnkelTidslinje[]} onSelect={onSelect} />
        </Container>
    );
};

export default TidslinjeWrapper;
