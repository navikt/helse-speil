import dayjs from 'dayjs';
import React, { ReactElement, ReactNode } from 'react';

import { BodyShort, HGrid } from '@navikt/ds-react';

import { useForrigeBehandlingPeriodeMedPeriode } from '@hooks/useForrigeBehandlingPeriode';
import { useTotalbeløp } from '@hooks/useTotalbeløp';
import { BeregnetPeriodeFragment, PersonFragment, Utbetalingsdagtype, Utbetalingstatus } from '@io/graphql';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { TidslinjeElement } from '@saksbilde/tidslinje/groupTidslinjedata';
import { DatePeriod, DateString, PeriodState } from '@typer/shared';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';
import { getPeriodState, getPeriodStateText } from '@utils/mapping';
import { cn } from '@utils/tw';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod } from '@utils/typeguards';

interface PeriodPopoverProps {
    element: TidslinjeElement;
    person: PersonFragment;
    erSelvstendigNæring?: boolean;
}

export function PeriodPopover({ element, person, erSelvstendigNæring = false }: PeriodPopoverProps): ReactElement {
    const period = element.periode ?? element.ghostPeriode ?? element.infotrygdPeriode;
    const fom = somNorskDato(element.fom) ?? '-';
    const tom = somNorskDato(element.tom) ?? '-';
    const state = getPeriodState(period);

    return (
        <HGrid columns={2} gap="space-4 space-24">
            {isInfotrygdPeriod(period) ? (
                <InfotrygdPopover fom={fom} tom={tom} />
            ) : isBeregnetPeriode(period) ? (
                <BeregnetPopover
                    period={period}
                    state={state}
                    fom={fom}
                    tom={tom}
                    person={person}
                    erSelvstendigNæringsdrivende={erSelvstendigNæring}
                />
            ) : isGhostPeriode(period) ? (
                <GhostPopover fom={fom} tom={tom} />
            ) : (
                <UberegnetPopover state={state} fom={fom} tom={tom} />
            )}
        </HGrid>
    );
}

interface TilkommenInntektPopoverProps {
    tilkommenInntekt: ApiTilkommenInntekt;
    element: TidslinjeElement;
}

export function TilkommenInntektPopover({ tilkommenInntekt, element }: TilkommenInntektPopoverProps): ReactElement {
    const fom = somNorskDato(element.fom) ?? '-';
    const tom = somNorskDato(element.tom) ?? '-';

    return (
        <HGrid columns={2} gap="space-4 space-24">
            <BodyShort size="small" className="col-span-2" weight="semibold">
                Tilkommen inntekt
                {tilkommenInntekt.fjernet ? ' (fjernet)' : ''}
            </BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </HGrid>
    );
}

function InfotrygdPopover({ fom, tom }: DatePeriod): ReactElement {
    return (
        <>
            <BodyShort size="small" className="col-span-2" weight="semibold">
                Behandlet i Infotrygd
            </BodyShort>
            <BodyShort size="small">Sykepenger</BodyShort>
            <BodyShort size="small">
                ({fom} - {tom})
            </BodyShort>
        </>
    );
}

interface SpleisPopoverProps extends DatePeriod {
    period: BeregnetPeriodeFragment;
    state: PeriodState;
    person: PersonFragment;
    erSelvstendigNæringsdrivende: boolean;
}

function BeregnetPopover({
    period,
    state,
    fom,
    tom,
    person,
    erSelvstendigNæringsdrivende,
}: SpleisPopoverProps): ReactElement {
    const dayTypes = groupDayTypes(period);

    const arbeidsgiverperiode = getDayTypesRender(Utbetalingsdagtype.Arbeidsgiverperiodedag, dayTypes);
    const ferieperiode = getDayTypesRender(Utbetalingsdagtype.Feriedag, dayTypes);
    const avslåttperiode = getDayTypesRender(Utbetalingsdagtype.AvvistDag, dayTypes);
    const harGenereltNotat = useHarGenereltNotat(period);

    const { personTotalbeløp, arbeidsgiverTotalbeløp, totalbeløp } = useTotalbeløp(
        erSelvstendigNæringsdrivende,
        period.tidslinje,
    );
    const forrigePeriode = useForrigeBehandlingPeriodeMedPeriode(period, person);
    const { totalbeløp: gammeltTotalbeløp } = useTotalbeløp(erSelvstendigNæringsdrivende, forrigePeriode?.tidslinje);

    return (
        <>
            <BodyShort size="small" className="col-span-2" weight="semibold">
                {getPeriodStateText(state)}
            </BodyShort>
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
                        className={cn(totalbeløp - gammeltTotalbeløp < 0 && 'font-semibold text-ax-text-danger-subtle')}
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
                    <BodyShort
                        className={cn(period.gjenstaendeSykedager <= 0 && 'text-ax-text-danger-subtle italic')}
                        size="small"
                    >
                        Dager igjen:
                    </BodyShort>
                    <BodyShort
                        className={cn(period.gjenstaendeSykedager <= 0 && 'text-ax-text-danger-subtle italic')}
                        size="small"
                    >
                        {period.gjenstaendeSykedager}
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
}

function GhostPopover({ fom, tom }: DatePeriod): ReactElement {
    return (
        <>
            <BodyShort size="small" className="col-span-2" weight="semibold">
                Arbeidsforhold uten sykefravær
            </BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
}

interface UberegnetPopoverProps extends DatePeriod {
    state: PeriodState;
}

function UberegnetPopover({ fom, tom, state }: UberegnetPopoverProps): ReactElement {
    const stateText = getPeriodStateText(state);

    return (
        <>
            <BodyShort size="small" className="col-span-2" weight="semibold">
                {stateText}
            </BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
}

function groupDayTypes(period: BeregnetPeriodeFragment): Map<Utbetalingsdagtype, DatePeriod[]> {
    const map = new Map<Utbetalingsdagtype, DatePeriod[]>();

    let currentDayType: Utbetalingsdagtype | undefined = period.tidslinje[0]?.utbetalingsdagtype;
    let currentFom: DateString | undefined = period.tidslinje[0]?.dato;

    const updateDayTypesMap = (i: number, map: Map<Utbetalingsdagtype, DatePeriod[]>): void => {
        if (!currentDayType || !currentFom) return;
        if (!map.has(currentDayType)) {
            map.set(currentDayType, []);
        }
        const tom = period.tidslinje[i - 1]?.dato;
        if (tom) map.get(currentDayType)?.push({ fom: currentFom, tom: tom });
    };

    for (let i = 1; i < period.tidslinje.length; i++) {
        const currentDay = period.tidslinje[i];
        if (currentDay && currentDay.utbetalingsdagtype !== currentDayType) {
            updateDayTypesMap(i, map);
            currentDayType = currentDay.utbetalingsdagtype;
            currentFom = currentDay.dato;
        }
    }

    updateDayTypesMap(period.tidslinje.length, map);

    return map;
}

function getDayTypesRender(dayType: Utbetalingsdagtype, map: Map<Utbetalingsdagtype, DatePeriod[]>): ReactNode {
    const periods = map.get(dayType);
    if (!periods || periods.length === 0) return undefined;
    if (periods.length === 1) {
        const period = periods[0];
        return period?.fom === period?.tom
            ? somNorskDato(period?.fom)
            : `${somNorskDato(period?.fom)} - ${somNorskDato(period?.tom)}`;
    }
    const antallDager = periods.reduce(
        (count, period) => count + dayjs(period.tom).diff(dayjs(period.fom), 'day') + 1,
        0,
    );
    return `${antallDager} dager`;
}

function useHarGenereltNotat(period: BeregnetPeriodeFragment) {
    const { data } = useGetNotaterForVedtaksperiode(period.vedtaksperiodeId);
    return data?.some((notat) => notat.type === 'Generelt') || false;
}
