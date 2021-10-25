import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { CSSProperties } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { useGjenståendeDager } from '../../../modell/utbetalingshistorikkelement';
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

interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export const tilPeriodeTekst = (utbetalingstidslinje: Utbetalingsdag[], dagtype: Dag['type']): string | undefined => {
    const split = splitPerioderPåDagtype(utbetalingstidslinje, dagtype);
    const antallDager = utbetalingstidslinje.filter(({ type }) => type === dagtype).length;
    return periodetekst(antallDager, split);
};

const splitPerioderPåDagtype = (utbetalingstidslinje: Utbetalingsdag[], dagtype: Dag['type']): Periode[] => {
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
        case 'utbetaltAutomatisk':
            return 'Automatisk utbetalt';
        case 'tilUtbetalingAutomatisk':
            return 'Sendt til automatisk utbetaling';
        case 'revurderes':
            return 'Til revurdering';
        case 'oppgaver':
            return 'Til behandling';
        case 'tilUtbetaling':
            return 'Sendt til utbetaling';
        case 'revurdert':
        case 'utbetalt':
            return 'Utbetalt';
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
            return 'Ingen utbetaling';
        case 'kunFerie':
            return 'Ferie';
        case 'kunPermisjon':
            return 'Permisjon';
        case 'venter':
        case 'venterPåKiling':
            return 'Venter';
        case 'annullert':
            return 'Annullert';
        case 'annulleringFeilet':
            return 'Annullering feilet';
        case 'tilAnnullering':
            return 'Sendt til annullering';
        case 'avslag':
            return 'Avslag';
        case 'feilet':
            return 'Feilet';
        case 'tilInfotrygd':
            return 'Sendt til infotrygd';
        default:
            return 'Ukjent';
    }
};

const LinjeFelt = styled(BodyShort)`
    font-size: 14px;
    display: inline;
`;

const LinjeVerdi = styled(BodyShort)`
    color: var(--text-color);
    display: inline;
`;

interface HoverInfoProps {
    tidslinjeperiode: Tidslinjeperiode;
}

export const HoverInfo = ({ tidslinjeperiode }: HoverInfoProps) => {
    const status = utbetalingstatus(tidslinjeperiode.tilstand);
    const gjenståendeDager = useGjenståendeDager(tidslinjeperiode.beregningId);
    const fom = tidslinjeperiode.fom.format(NORSK_DATOFORMAT);
    const tom = tidslinjeperiode.tom.format(NORSK_DATOFORMAT);
    const utbetalingstidslinje = tidslinjeperiode.utbetalingstidslinje ?? [];

    const arbeidsgiverperiode = tilPeriodeTekst(utbetalingstidslinje, 'Arbeidsgiverperiode');
    const utbetaltBeløp = utbetalingstidslinje.reduce((sum, dag) => sum + (dag.utbetaling ?? 0), 0);
    const ferieperiode = tilPeriodeTekst(utbetalingstidslinje, 'Ferie');
    const permisjonsperiode = tilPeriodeTekst(utbetalingstidslinje, 'Permisjon');

    return (
        <Container>
            <Linje>
                <LinjeFelt as="p">Status: </LinjeFelt>
                <LinjeVerdi as="p"> {status} </LinjeVerdi>
            </Linje>
            <Linje>
                <LinjeFelt as="p">Periode: </LinjeFelt>
                <LinjeVerdi as="p">
                    {fom} - {tom}
                </LinjeVerdi>
            </Linje>
            {['utbetaltAutomatisk', 'utbetalt', 'revurdertIngenUtbetaling', 'revurdert', 'annullert'].includes(
                tidslinjeperiode.tilstand
            ) && (
                <Linje>
                    <LinjeFelt as="p">Utbetalt: </LinjeFelt>
                    <LinjeVerdi as="p">{somPenger(utbetaltBeløp)} </LinjeVerdi>
                </Linje>
            )}
            {arbeidsgiverperiode && (
                <Linje>
                    <LinjeFelt as="p">Arbeidsgiverperiode: </LinjeFelt>
                    <LinjeVerdi as="p">{arbeidsgiverperiode} </LinjeVerdi>
                </Linje>
            )}
            {ferieperiode && (
                <Linje>
                    <LinjeFelt as="p">Ferie: </LinjeFelt>
                    <LinjeVerdi as="p">{ferieperiode} </LinjeVerdi>
                </Linje>
            )}
            {permisjonsperiode && (
                <Linje>
                    <LinjeFelt as="p">Permisjon: </LinjeFelt>
                    <LinjeVerdi as="p">{permisjonsperiode} </LinjeVerdi>
                </Linje>
            )}
            {gjenståendeDager !== null && (
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
                    <LinjeFelt as="p">Dager igjen: </LinjeFelt> <LinjeVerdi as="p">{gjenståendeDager}</LinjeVerdi>
                </Linje>
            )}
        </Container>
    );
};
