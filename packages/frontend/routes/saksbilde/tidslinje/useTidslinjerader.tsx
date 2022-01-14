import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';

import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';

import { HoverInfo, HoverInfoUtenSykefravær } from './HoverInfo';
import { arbeidsgiverNavn } from './Tidslinje';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { ghostToggles } from '../../../featureToggles';

const MANGLENDE_BEREGNINGID_VED_PERIDOE_UTEN_SYKEFRAVÆR = '_';
const MANGLENDE_UNIQUEID_VED_PERIDOE_UTEN_SYKEFRAVÆR = '_';

export type TidslinjeradObject = {
    id: string;
    perioder: TidslinjeperiodeObject[];
    arbeidsgiver: string;
    erAktiv: boolean;
};

const harDagtyper = (dagtyper: Dag['type'][], tidslinje: Utbetalingsdag[]): boolean =>
    !!tidslinje.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (tidslinje: Utbetalingsdag[]): boolean =>
    harDagtyper(['Ferie', 'Arbeidsgiverperiode', 'Permisjon'], tidslinje);

export const toTidslinjeperioder = (
    tidslinjeperioder: TidslinjeperiodeMedSykefravær[],
    tidslinjeperioderUtenSykefravær: TidslinjeperiodeUtenSykefravær[],
    fom: Dayjs,
    tom: Dayjs
): TidslinjeperiodeObject[] => {
    const perioderMedSykefravær = tidslinjeperioder.map((it) => {
        return {
            id: `${it.id}+${it.beregningId}+${it.unique}`,
            start: it.fom.toDate(),
            end: it.tom.toDate(),
            tilstand: it.tilstand,
            utbetalingstype: it.type.toString().toLowerCase(),
            skalVisePin: it.utbetalingstidslinje && skalViseInfoPin(it.utbetalingstidslinje),
            hoverLabel: <HoverInfo tidslinjeperiode={it} />,
        };
    });

    const perioderUtenSykefravær = tidslinjeperioderUtenSykefravær.map((it) => ({
        id: `${it.id}+${MANGLENDE_BEREGNINGID_VED_PERIDOE_UTEN_SYKEFRAVÆR}+${MANGLENDE_UNIQUEID_VED_PERIDOE_UTEN_SYKEFRAVÆR}`,
        start: it.fom.toDate(),
        end: it.tom.toDate(),
        tilstand: it.tilstand,
        skalVisePin: false,
        hoverLabel: <HoverInfoUtenSykefravær fom={it.fom} tom={it.tom} />,
    }));

    const perioderTilVisning = ghostToggles.viseGhostPølserEnabled
        ? [...perioderMedSykefravær, ...perioderUtenSykefravær]
        : perioderMedSykefravær;

    return getPositionedPeriods(fom.toDate(), tom.toDate(), perioderTilVisning, 'right') as TidslinjeperiodeObject[];
};

const toArbeidsgiverrader = (
    arbeidsgiver: Arbeidsgiver,
    fom: Dayjs,
    tom: Dayjs,
    skalAnonymisereData: boolean
): TidslinjeradObject[] => {
    const raderMedOgUtenSykdom = arbeidsgiver.tidslinjeperioder.map(
        (periodeMedSykefravær) =>
            ({
                id: nanoid(),
                perioder: toTidslinjeperioder(
                    periodeMedSykefravær,
                    arbeidsgiver.tidslinjeperioderUtenSykefravær,
                    fom,
                    tom
                ),
                arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                erAktiv: false,
            } as TidslinjeradObject)
    );
    const orgnummereMedSykdom = arbeidsgiver.tidslinjeperioder.flat().map((tidslinje) => tidslinje.organisasjonsnummer);
    const raderUtenSykdom = [
        arbeidsgiver.tidslinjeperioderUtenSykefravær.filter(
            (tidslinjeperiode) => !orgnummereMedSykdom.includes(tidslinjeperiode.organisasjonsnummer)
        ),
    ].map(
        (periodeUtenSykefravær) =>
            ({
                id: nanoid(),
                perioder: toTidslinjeperioder([], periodeUtenSykefravær, fom, tom),
                arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                erAktiv: false,
            } as TidslinjeradObject)
    );

    return [...raderMedOgUtenSykdom, ...raderUtenSykdom].filter(
        (tidslinjeradObjekt) => tidslinjeradObjekt.perioder.length > 0
    );
};

export const useTidslinjerader = (
    person: Person,
    fom: Dayjs,
    tom: Dayjs,
    skalAnonymisereData: boolean
): { id: string; navn: string; rader: TidslinjeradObject[] }[] =>
    useMemo(
        () =>
            person.arbeidsgivere.map((arbeidsgiver) => ({
                id: arbeidsgiver.organisasjonsnummer,
                navn: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                rader: toArbeidsgiverrader(arbeidsgiver, fom, tom, skalAnonymisereData),
            })),
        [person, fom, tom]
    );
