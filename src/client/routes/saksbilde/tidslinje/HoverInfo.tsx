import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import {
    Dagtype,
    Tidslinjetilstand,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import React, { CSSProperties } from 'react';

import { Undertekst } from 'nav-frontend-typografi';

import { FlexColumn } from '../../../components/Flex';
import { Tidslinjeperiode, useGjenståendeDager, useNettobeløp } from '../../../modell/UtbetalingshistorikkElement';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { somPenger } from '../../../utils/locale';

const Container = styled(FlexColumn)`
    align-items: flex-start;
`;

const Linje = styled.div`
    white-space: nowrap;
    user-select: text;
    color: var(--text-color);
`;

const utbetaltForPeriode = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number | undefined => {
    if (vedtaksperiode.fullstendig) {
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

interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export const tilPeriodeTekst = (utbetalingstidslinje: Utbetalingsdag[], dagtype: Dagtype): string | undefined => {
    const split = splitPerioderPåDagtype(utbetalingstidslinje, dagtype);
    const antallDager = utbetalingstidslinje.filter(({ type }) => type === dagtype).length;
    return periodetekst(antallDager, split);
};

const splitPerioderPåDagtype = (utbetalingstidslinje: Utbetalingsdag[], dagtype: Dagtype): Periode[] => {
    let resultat: Periode[] = [];
    let påbegyntPeriode: Dayjs | undefined;
    utbetalingstidslinje.forEach((dag) => {
        if (dag.type === dagtype && !påbegyntPeriode) {
            påbegyntPeriode = dag.dato;
        }
        if (påbegyntPeriode && dag.type !== dagtype) {
            resultat = [...resultat, { fom: påbegyntPeriode, tom: dag.dato.subtract(1, 'day') }];
            påbegyntPeriode = undefined;
        }
    });
    if (påbegyntPeriode) {
        resultat = [
            ...resultat,
            { fom: påbegyntPeriode, tom: utbetalingstidslinje[utbetalingstidslinje.length - 1].dato },
        ];
    }
    return resultat;
};

const periodetekst = (antallDager: number, perioder: Periode[]): string | undefined => {
    if (perioder.length === 0) return undefined;
    if (perioder.length === 1) {
        if (perioder[0].fom.isSame(perioder[0].tom)) return perioder[0].fom.format(NORSK_DATOFORMAT);
        return `${perioder[0].fom.format(NORSK_DATOFORMAT)} - ${perioder[0].tom.format(NORSK_DATOFORMAT)}`;
    }
    return `${antallDager} dager`;
};

const utbetalingstatus = (status: Tidslinjetilstand) => {
    switch (status) {
        case Tidslinjetilstand.UtbetaltAutomatisk:
            return 'Automatisk utbetalt';
        case Tidslinjetilstand.TilUtbetalingAutomatisk:
            return 'Sendt til automatisk utbetaling';
        case Tidslinjetilstand.Revurderes:
            return 'Til revurdering';
        case Tidslinjetilstand.Oppgaver:
            return 'Til behandling';
        case Tidslinjetilstand.TilUtbetaling:
            return 'Sendt til utbetaling';
        case Tidslinjetilstand.Revurdert:
        case Tidslinjetilstand.Utbetalt:
            return 'Utbetalt';
        case Tidslinjetilstand.IngenUtbetaling:
            return 'Ingen utbetaling';
        case Tidslinjetilstand.KunFerie:
            return 'Ferie';
        case Tidslinjetilstand.KunPermisjon:
            return 'Permisjon';
        case Tidslinjetilstand.Venter:
        case Tidslinjetilstand.VenterPåKiling:
            return 'Venter';
        case Tidslinjetilstand.Annullert:
            return 'Annullert';
        case Tidslinjetilstand.AnnulleringFeilet:
            return 'Annullering feilet';
        case Tidslinjetilstand.TilAnnullering:
            return 'Sendt til annullering';
        case Tidslinjetilstand.Avslag:
            return 'Avslag';
        case Tidslinjetilstand.Feilet:
            return 'Feilet';
        case Tidslinjetilstand.TilInfotrygd:
            return 'Sendt til infotrygd';
        default:
            return 'Ukjent';
    }
};

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
    font-size: 0.875rem;
    display: inline;
`;

const LinjeVerdi = styled(Undertekst)`
    font-size: 1rem;
    color: var(--text-color);
    display: inline;
`;

export const HoverInfo = ({ vedtaksperiode }: HoverInfoProps) => {
    const status = statusType(vedtaksperiode);
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT);
    const dagerIgjen = vedtaksperiode.fullstendig
        ? (vedtaksperiode as Vedtaksperiode).vilkår?.dagerIgjen.gjenståendeDager
        : undefined;

    const utbetalt = utbetaltForPeriode(vedtaksperiode);
    const utbetalingstidslinje = vedtaksperiode.utbetalingstidslinje ?? [];
    const arbeidsgiverperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Arbeidsgiverperiode);
    const ferieperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Ferie);
    const permisjonsperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Permisjon);

    return (
        <Container>
            <Linje>
                <LinjeFelt>Status: </LinjeFelt>
                <LinjeVerdi> {status} </LinjeVerdi>
            </Linje>
            <Linje>
                <LinjeFelt>Periode: </LinjeFelt>
                <LinjeVerdi>
                    {fom} - {tom}
                </LinjeVerdi>
            </Linje>
            {utbetalt && utbetalt !== 0 && (
                <Linje>
                    <LinjeFelt>Utbetalt: </LinjeFelt>
                    <LinjeVerdi>{somPenger(utbetalt)} </LinjeVerdi>
                </Linje>
            )}
            {arbeidsgiverperiode && (
                <Linje>
                    <LinjeFelt>Arbeidsgiverperiode: </LinjeFelt>
                    <LinjeVerdi>{arbeidsgiverperiode} </LinjeVerdi>
                </Linje>
            )}
            {ferieperiode && (
                <Linje>
                    <LinjeFelt>Ferie: </LinjeFelt>
                    <LinjeVerdi>{ferieperiode} </LinjeVerdi>
                </Linje>
            )}
            {permisjonsperiode && (
                <Linje>
                    <LinjeFelt>Permisjon: </LinjeFelt>
                    <LinjeVerdi>{permisjonsperiode} </LinjeVerdi>
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

interface TidslinjeperiodeHoverInfoProps {
    tidslinjeperiode: Tidslinjeperiode;
}

export const TidslinjeperiodeHoverInfo = ({ tidslinjeperiode }: TidslinjeperiodeHoverInfoProps) => {
    const status = utbetalingstatus(tidslinjeperiode.tilstand);
    const gjenståendeDager = useGjenståendeDager(tidslinjeperiode.beregningId);
    const nettobeløp = useNettobeløp(tidslinjeperiode.beregningId);
    const fom = tidslinjeperiode.fom.format(NORSK_DATOFORMAT);
    const tom = tidslinjeperiode.tom.format(NORSK_DATOFORMAT);

    const utbetalingstidslinje = tidslinjeperiode.utbetalingstidslinje ?? [];
    const arbeidsgiverperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Arbeidsgiverperiode);
    const ferieperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Ferie);
    const permisjonsperiode = tilPeriodeTekst(utbetalingstidslinje, Dagtype.Permisjon);

    return (
        <Container>
            <Linje>
                <LinjeFelt>Status: </LinjeFelt>
                <LinjeVerdi> {status} </LinjeVerdi>
            </Linje>
            <Linje>
                <LinjeFelt>Periode: </LinjeFelt>
                <LinjeVerdi>
                    {fom} - {tom}
                </LinjeVerdi>
            </Linje>
            {[
                Tidslinjetilstand.UtbetaltAutomatisk,
                Tidslinjetilstand.Utbetalt,
                Tidslinjetilstand.Revurdert,
                Tidslinjetilstand.Annullert,
            ].includes(tidslinjeperiode.tilstand) &&
                nettobeløp != undefined && (
                    <Linje>
                        <LinjeFelt>Utbetalt: </LinjeFelt>
                        <LinjeVerdi>{somPenger(nettobeløp)} </LinjeVerdi>
                    </Linje>
                )}
            {arbeidsgiverperiode && (
                <Linje>
                    <LinjeFelt>Arbeidsgiverperiode: </LinjeFelt>
                    <LinjeVerdi>{arbeidsgiverperiode} </LinjeVerdi>
                </Linje>
            )}
            {ferieperiode && (
                <Linje>
                    <LinjeFelt>Ferie: </LinjeFelt>
                    <LinjeVerdi>{ferieperiode} </LinjeVerdi>
                </Linje>
            )}
            {permisjonsperiode && (
                <Linje>
                    <LinjeFelt>Permisjon: </LinjeFelt>
                    <LinjeVerdi>{permisjonsperiode} </LinjeVerdi>
                </Linje>
            )}
            {gjenståendeDager !== undefined && (
                <Linje
                    style={
                        {
                            '--text-color':
                                gjenståendeDager <= 0
                                    ? 'var(--navds-color-text-error)'
                                    : 'var(--navds-color-text-primary)',
                        } as CSSProperties
                    }
                >
                    <LinjeFelt>Dager igjen: </LinjeFelt> <LinjeVerdi>{gjenståendeDager}</LinjeVerdi>
                </Linje>
            )}
        </Container>
    );
};
