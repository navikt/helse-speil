import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, ReactNode } from 'react';

import type { PopoverProps } from '@navikt/ds-react';
import { BodyShort, Popover } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useForrigeGenerasjonPeriodeMedPeriode } from '@hooks/useForrigeGenerasjonPeriode';
import { useTotalbeløp } from '@hooks/useTotalbeløp';
import { BeregnetPeriodeFragment, NotatType, PersonFragment, Utbetalingsdagtype, Utbetalingstatus } from '@io/graphql';
import { useGjenståendeDager } from '@state/arbeidsgiver';
import { DatePeriod, DateString, PeriodState } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';
import { getPeriodStateText } from '@utils/mapping';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isTilkommenInntekt } from '@utils/typeguards';

import styles from './PeriodPopover.module.css';

const groupDayTypes = (period: BeregnetPeriodeFragment): Map<Utbetalingsdagtype, Array<DatePeriod>> => {
    const map = new Map<Utbetalingsdagtype, Array<DatePeriod>>();

    let currentDayType: Utbetalingsdagtype = period.tidslinje[0]?.utbetalingsdagtype;
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

const InfotrygdPopover = ({ fom, tom }: DatePeriod): ReactElement => {
    return (
        <>
            <BodyShort size="small">Behandlet i Infotrygd</BodyShort>
            <BodyShort size="small">Sykepenger</BodyShort>
            <BodyShort size="small">
                ({fom} - {tom})
            </BodyShort>
        </>
    );
};

interface SpleisPopoverProps extends DatePeriod {
    period: BeregnetPeriodeFragment;
    state: PeriodState;
    person: PersonFragment;
}

export const BeregnetPopover = ({ period, state, fom, tom, person }: SpleisPopoverProps): ReactElement => {
    const dayTypes = groupDayTypes(period);

    const arbeidsgiverperiode = getDayTypesRender(Utbetalingsdagtype.Arbeidsgiverperiodedag, dayTypes);
    const ferieperiode = getDayTypesRender(Utbetalingsdagtype.Feriedag, dayTypes);
    const avslåttperiode = getDayTypesRender(Utbetalingsdagtype.AvvistDag, dayTypes);
    const harGenereltNotat = period.notater.filter((notat) => notat.type === NotatType.Generelt).length > 0;

    const { personTotalbeløp, arbeidsgiverTotalbeløp, totalbeløp } = useTotalbeløp(period.tidslinje);
    const forrigePeriode = useForrigeGenerasjonPeriodeMedPeriode(period);
    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(forrigePeriode?.tidslinje);
    const gjenståendeDager = useGjenståendeDager(period, person);

    return (
        <>
            <BodyShort size="small">{getPeriodStateText(state)}</BodyShort>
            {(arbeidsgiverTotalbeløp !== 0 || personTotalbeløp !== 0) && (
                <>
                    <BodyShort size="small">Mottaker:</BodyShort>
                    <BodyShort size="small">
                        {arbeidsgiverTotalbeløp !== 0 && 'Arbeidsgiver'}
                        {arbeidsgiverTotalbeløp !== 0 && personTotalbeløp !== 0 && ' / '}
                        {personTotalbeløp !== 0 && 'Sykmeldt'}
                    </BodyShort>
                </>
            )}
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
            {personTotalbeløp !== 0 && (
                <>
                    <BodyShort size="small">
                        {state === 'tilGodkjenning' ? 'Utbetaling' : 'Utbetalt'} til sykmeldt:
                    </BodyShort>
                    <BodyShort size="small">{somPenger(personTotalbeløp)}</BodyShort>
                </>
            )}
            {arbeidsgiverTotalbeløp !== 0 && (
                <>
                    <BodyShort size="small">
                        {state === 'tilGodkjenning' ? 'Utbetaling' : 'Utbetalt'} til arbeidsgiver:
                    </BodyShort>
                    <BodyShort size="small">{somPenger(arbeidsgiverTotalbeløp)}</BodyShort>
                </>
            )}
            {forrigePeriode && period.utbetaling.status === Utbetalingstatus.Ubetalt && (
                <>
                    <BodyShort size="small">Differanse</BodyShort>
                    <BodyShort
                        size="small"
                        className={classNames({ [styles.NegativePenger]: totalbeløp - gammeltTotalbeløp < 0 })}
                    >
                        {somPenger(totalbeløp - gammeltTotalbeløp)}
                    </BodyShort>
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
            {period.gjenstaendeSykedager !== null && period.gjenstaendeSykedager !== undefined && (
                <>
                    <BodyShort className={classNames(period.gjenstaendeSykedager <= 0 && styles.Error)} size="small">
                        Dager igjen:
                    </BodyShort>
                    <BodyShort className={classNames(period.gjenstaendeSykedager <= 0 && styles.Error)} size="small">
                        {gjenståendeDager}
                    </BodyShort>
                </>
            )}
            {harGenereltNotat && (
                <>
                    <BodyShort size="small">Notat</BodyShort>
                </>
            )}
        </>
    );
};

const GhostPopover = ({ fom, tom }: DatePeriod): ReactElement => {
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

const TilkommenPopover = ({ fom, tom }: DatePeriod): ReactElement => {
    return (
        <>
            <BodyShort size="small">Tilkommen inntekt</BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
};

interface UberegnetPopoverProps extends DatePeriod {
    state: PeriodState;
}

const UberegnetPopover = ({ fom, tom, state }: UberegnetPopoverProps): ReactElement => {
    const stateText = getPeriodStateText(state);

    return (
        <>
            <BodyShort size="small">{stateText}</BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
};

interface PeriodPopoverProps extends Omit<PopoverProps, 'children'> {
    period: TimelinePeriod;
    state: PeriodState;
    person: PersonFragment;
}

export const PeriodPopover = ({ period, state, person, ...popoverProps }: PeriodPopoverProps): ReactElement => {
    const fom = dayjs(period.fom).format(NORSK_DATOFORMAT);
    const tom = dayjs(period.tom).format(NORSK_DATOFORMAT);

    return (
        <Popover {...popoverProps}>
            <Popover.Content className={styles.RouteContainer}>
                <ErrorBoundary fallback={<div />}>
                    {isInfotrygdPeriod(period) ? (
                        <InfotrygdPopover fom={fom} tom={tom} />
                    ) : isBeregnetPeriode(period) ? (
                        <BeregnetPopover period={period} state={state} fom={fom} tom={tom} person={person} />
                    ) : isGhostPeriode(period) ? (
                        <GhostPopover fom={fom} tom={tom} />
                    ) : isTilkommenInntekt(period) ? (
                        <TilkommenPopover fom={fom} tom={tom} />
                    ) : (
                        <UberegnetPopover state={state} fom={fom} tom={tom} />
                    )}
                </ErrorBoundary>
            </Popover.Content>
        </Popover>
    );
};
