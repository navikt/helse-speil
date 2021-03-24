import React, { CSSProperties } from 'react';
import { FlexColumn } from '../Flex';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Undertekst } from 'nav-frontend-typografi';
import { Dagtype, UfullstendigVedtaksperiode, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { somPenger } from '../../utils/locale';

const Container = styled(FlexColumn)`
    align-items: flex-start;
`;

const Linje = styled.div`
    white-space: nowrap;
    user-select: text;
    color: var(--text-color);
`;

const utbetaltForPeriode = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number | undefined => {
    if (vedtaksperiode.kanVelges) {
        const { behandlet, automatiskBehandlet, utbetalingstidslinje } = vedtaksperiode as Vedtaksperiode;
        return (
            ((behandlet || automatiskBehandlet) &&
                utbetalingstidslinje.reduce((utbetalt, { utbetaling }) => utbetalt + (utbetaling ?? 0), 0)) ||
            undefined
        );
    } else {
        return undefined;
    }
};

const antallArbeidsgiverperiodedager = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number =>
    vedtaksperiode.utbetalingstidslinje?.filter(({ type }) => type === Dagtype.Arbeidsgiverperiode).length ?? 0;

const antallFeriedager = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number =>
    vedtaksperiode.utbetalingstidslinje?.filter(({ type }) => type === Dagtype.Ferie).length ?? 0;

const antallPermisjonsdager = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number =>
    vedtaksperiode.utbetalingstidslinje?.filter(({ type }) => type === Dagtype.Permisjon).length ?? 0;

const statusType = (periode: Vedtaksperiode | UfullstendigVedtaksperiode): string => {
    switch (periode.tilstand) {
        case Vedtaksperiodetilstand.Oppgaver:
            return 'Til behandling';
        case Vedtaksperiodetilstand.TilUtbetaling:
            return 'automatiskBehandlet' in periode && periode.automatiskBehandlet
                ? 'Sendt til automatisk utbetaling'
                : 'Sendt til utbetaling';
        case Vedtaksperiodetilstand.Utbetalt:
            return 'automatiskBehandlet' in periode && periode.automatiskBehandlet ? 'Automatisk utbetalt' : 'Utbetalt';
        case Vedtaksperiodetilstand.IngenUtbetaling:
            return 'Ingen utbetaling';
        case Vedtaksperiodetilstand.KunFerie:
            return 'Ferie';
        case Vedtaksperiodetilstand.KunPermisjon:
            return 'Permisjon';
        case Vedtaksperiodetilstand.Venter:
        case Vedtaksperiodetilstand.VenterPåKiling:
            return 'Venter';
        case Vedtaksperiodetilstand.Annullert:
            return 'Annullert';
        case Vedtaksperiodetilstand.AnnulleringFeilet:
            return 'Annullering feilet';
        case Vedtaksperiodetilstand.TilAnnullering:
            return 'Sendt til annullering';
        case Vedtaksperiodetilstand.Avslag:
            return 'Avslag';
        case Vedtaksperiodetilstand.Feilet:
            return 'Feilet';
        case Vedtaksperiodetilstand.TilInfotrygd:
            return 'Sendt til infotrygd';
    }
    return 'Ukjent';
};

interface HoverInfoProps {
    vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode;
}

const LinjeFelt = styled(Undertekst)`
    font-size: 14px;
    display: inline;
`;

const LinjeVerdi = styled(Undertekst)`
    font-size: 16px;
    color: var(--text-color);
    display: inline;
`;

export const HoverInfo = ({ vedtaksperiode }: HoverInfoProps) => {
    const status = statusType(vedtaksperiode);
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT);
    const dagerIgjen = vedtaksperiode.kanVelges
        ? (vedtaksperiode as Vedtaksperiode).vilkår?.dagerIgjen.gjenståendeDager
        : undefined;

    const utbetalt = utbetaltForPeriode(vedtaksperiode);
    const arbeidsgiverperiodedager = antallArbeidsgiverperiodedager(vedtaksperiode);
    const feriedager = antallFeriedager(vedtaksperiode);
    const permisjonsdager = antallPermisjonsdager(vedtaksperiode);

    return (
        <Container>
            <Linje>
                <LinjeFelt>Status: </LinjeFelt> <LinjeVerdi> {status} </LinjeVerdi>
            </Linje>
            <Linje>
                <LinjeFelt>Periode: </LinjeFelt>
                <LinjeVerdi>
                    {fom} - {tom}
                </LinjeVerdi>
            </Linje>
            {utbetalt && utbetalt !== 0 && (
                <Linje>
                    <LinjeFelt>Utbetalt: </LinjeFelt> <LinjeVerdi>{somPenger(utbetalt)} </LinjeVerdi>
                </Linje>
            )}
            {arbeidsgiverperiodedager !== 0 && (
                <Linje>
                    <LinjeFelt>Arbeidsgiverperiode: </LinjeFelt>
                    <LinjeVerdi>{arbeidsgiverperiodedager} dager </LinjeVerdi>
                </Linje>
            )}
            {feriedager !== 0 && (
                <Linje>
                    <LinjeFelt>Ferie:</LinjeFelt> <LinjeVerdi>{feriedager} dager</LinjeVerdi>
                </Linje>
            )}
            {permisjonsdager !== 0 && (
                <Linje>
                    <LinjeFelt>Permisjon:</LinjeFelt> <LinjeVerdi>{permisjonsdager} dager</LinjeVerdi>
                </Linje>
            )}
            {dagerIgjen !== undefined && (
                <Linje
                    style={
                        {
                            '--text-color':
                                dagerIgjen <= 0 ? 'var(--navds-color-text-error)' : 'var(--navds-color-text-primary)',
                        } as CSSProperties
                    }
                >
                    <LinjeFelt>Dager igjen: </LinjeFelt> <LinjeVerdi>{dagerIgjen}</LinjeVerdi>
                </Linje>
            )}
        </Container>
    );
};
