import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import type { PopoverProps } from '@navikt/ds-react';
import { BodyShort, Popover } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';
import { NORSK_DATOFORMAT } from '@utils/date';
import { BeregnetPeriode, Utbetalingsdagtype } from '@io/graphql';
import { ErrorBoundary } from '@components/ErrorBoundary';

import styles from './PeriodPopover.module.css';
import { getPeriodStateText } from '@utils/mapping';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod } from '@utils/typeguards';

const groupDayTypes = (period: BeregnetPeriode): Map<Utbetalingsdagtype, Array<DatePeriod>> => {
    const map = new Map<Utbetalingsdagtype, Array<DatePeriod>>();

    let currentDayType: Utbetalingsdagtype = period.tidslinje[0].utbetalingsdagtype;
    let currentFom: DateString = period.tidslinje[0]?.dato;

    const updateDayTypesMap = (i: number, map: Map<Utbetalingsdagtype, Array<DatePeriod>>): void => {
        if (!map.has(currentDayType)) {
            map.set(currentDayType, []);
        }
        map.get(currentDayType)?.push({ fom: currentFom, tom: period.tidslinje[i - 1]?.dato });
    };

    for (let i = 1; i < period.tidslinje.length; i++) {
        const currentDay = period.tidslinje[i];
        if (currentDay.utbetalingsdagtype !== currentDayType) {
            updateDayTypesMap(i, map);
            currentDayType = currentDay.utbetalingsdagtype;
            currentFom = currentDay.dato;
        }
    }

    updateDayTypesMap(period.tidslinje.length, map);

    return map;
};

const getDayTypesRender = (dayType: Utbetalingsdagtype, map: Map<Utbetalingsdagtype, Array<DatePeriod>>): ReactNode => {
    const periods = map.get(dayType);
    if (!periods || periods.length === 0) return undefined;
    if (periods.length === 1) {
        const period = periods[0];
        return period.fom === period.tom
            ? dayjs(period.fom).format(NORSK_DATOFORMAT)
            : `${dayjs(period.fom).format(NORSK_DATOFORMAT)} - ${dayjs(period.tom).format(NORSK_DATOFORMAT)}`;
    }
    const antallDager = periods.reduce(
        (count, period) => count + dayjs(period.tom).diff(dayjs(period.fom), 'day') + 1,
        0,
    );
    return `${antallDager} dager`;
};

interface InfotrygdPopoverProps extends DatePeriod {
    period: InfotrygdPeriod;
}

const InfotrygdPopover: React.VFC<InfotrygdPopoverProps> = ({ period, fom, tom }) => {
    return (
        <>
            <BodyShort size="small">Behandlet i Infotrygd</BodyShort>
            <BodyShort size="small">Sykepenger</BodyShort>
            <BodyShort size="small">
                ({fom} - {tom})
            </BodyShort>
            <BodyShort size="small">Type:</BodyShort>
            <BodyShort size="small">{period.typetekst}</BodyShort>
            <BodyShort size="small">Grad:</BodyShort>
            <BodyShort size="small">{period.grad} %</BodyShort>
            <BodyShort size="small">Dagsats:</BodyShort>
            <BodyShort size="small">{somPenger(period.dagsats)}</BodyShort>
        </>
    );
};

interface SpleisPopoverProps extends DatePeriod {
    period: BeregnetPeriode;
    state: PeriodState;
}

const BeregnetPopover: React.VFC<SpleisPopoverProps> = ({ period, state, fom, tom }) => {
    const dayTypes = groupDayTypes(period);

    const arbeidsgiverperiode = getDayTypesRender(Utbetalingsdagtype.Arbeidsgiverperiodedag, dayTypes);
    const ferieperiode = getDayTypesRender(Utbetalingsdagtype.Feriedag, dayTypes);
    const avslåttperiode = getDayTypesRender(Utbetalingsdagtype.AvvistDag, dayTypes);
    // const permisjonsperiode = getDayTypesRender(Utbetalingsdagtype.Permisjonsdag, dayTypes);

    return (
        <>
            <BodyShort size="small">{getPeriodStateText(state)}</BodyShort>
            {(period.utbetaling.arbeidsgiverNettoBelop !== 0 || period.utbetaling.personNettoBelop !== 0) && (
                <>
                    <BodyShort size="small">Mottaker:</BodyShort>
                    <BodyShort size="small">
                        {period.utbetaling.arbeidsgiverNettoBelop !== 0 && 'Arbeidsgiver'}
                        {period.utbetaling.personNettoBelop !== 0 && ' / Sykmeldt'}
                    </BodyShort>
                </>
            )}
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
            {period.utbetaling.personNettoBelop !== 0 && (
                <>
                    <BodyShort size="small">{state === 'oppgaver' ? 'Utbetaling' : 'Utbetalt'} til sykmeldt:</BodyShort>
                    <BodyShort size="small">{somPenger(period.utbetaling.personNettoBelop)}</BodyShort>
                </>
            )}
            {period.utbetaling.arbeidsgiverNettoBelop !== 0 && (
                <>
                    <BodyShort size="small">
                        {state === 'oppgaver' ? 'Utbetaling' : 'Utbetalt'} til arbeidsgiver:
                    </BodyShort>
                    <BodyShort size="small">{somPenger(period.utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
                </>
            )}
            {arbeidsgiverperiode && (
                <>
                    <BodyShort size="small">Arbeidsgiverperiode:</BodyShort>
                    <BodyShort size="small">{arbeidsgiverperiode}</BodyShort>
                </>
            )}
            {ferieperiode && (
                <>
                    <BodyShort size="small">Ferie:</BodyShort>
                    <BodyShort size="small">{ferieperiode}</BodyShort>
                </>
            )}
            {avslåttperiode && (
                <>
                    <BodyShort size="small">Avslått:</BodyShort>
                    <BodyShort size="small">{avslåttperiode}</BodyShort>
                </>
            )}
            {/*{permisjonsperiode && (*/}
            {/*    <>*/}
            {/*        <BodyShort size='small'>Permisjon:</BodyShort>*/}
            {/*        <BodyShort size='small'>{permisjonsperiode}</BodyShort>*/}
            {/*    </>*/}
            {/*)}*/}
            {period.gjenstaendeSykedager !== null && period.gjenstaendeSykedager !== undefined && (
                <>
                    <BodyShort className={classNames(period.gjenstaendeSykedager <= 0 && styles.Error)} size="small">
                        Dager igjen:
                    </BodyShort>
                    <BodyShort className={classNames(period.gjenstaendeSykedager <= 0 && styles.Error)} size="small">
                        {period.gjenstaendeSykedager}
                    </BodyShort>
                </>
            )}
        </>
    );
};

const GhostPopover: React.VFC<DatePeriod> = ({ fom, tom }) => {
    return (
        <>
            <BodyShort size="small">Arbeidsforhold uten sykefravær</BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
};

const UberegnetPopover: React.VFC<DatePeriod> = ({ fom, tom }) => {
    return (
        <>
            <BodyShort size="small">Venter</BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
};

interface PeriodPopoverProps extends Omit<PopoverProps, 'children'> {
    period: DatePeriod;
    state: PeriodState;
}

export const PeriodPopover: React.VFC<PeriodPopoverProps> = ({ period, state, ...popoverProps }) => {
    const fom = dayjs(period.fom).format(NORSK_DATOFORMAT);
    const tom = dayjs(period.tom).format(NORSK_DATOFORMAT);

    return (
        <Popover {...popoverProps}>
            <Popover.Content className={styles.RouteContainer}>
                <ErrorBoundary fallback={<div />}>
                    {isInfotrygdPeriod(period) ? (
                        <InfotrygdPopover period={period} fom={fom} tom={tom} />
                    ) : isBeregnetPeriode(period) ? (
                        <BeregnetPopover period={period} state={state} fom={fom} tom={tom} />
                    ) : isGhostPeriode(period) ? (
                        <GhostPopover fom={fom} tom={tom} />
                    ) : (
                        <UberegnetPopover fom={fom} tom={tom} />
                    )}
                </ErrorBoundary>
            </Popover.Content>
        </Popover>
    );
};
