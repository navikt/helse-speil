import { Utbetaling, UtbetalingshistorikkElement } from '../../../types/types.tidslinjer';
import {
    Arbeidsgiver,
    Dagtype,
    Person,
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import { useMemo } from 'react';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { arbeidsgiverNavn } from './Tidslinje';
import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';
import { PerioderBuilder } from './perioderBuilder';
import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import React from 'react';
import { HoverInfo } from './HoverInfo';

export type TidslinjeradObject = {
    id: string;
    perioder: TidslinjeperiodeObject[];
    arbeidsgiver: string;
    erAktiv: boolean;
    radtype?: string;
};

export interface CollapsedUtbetalingshistorikkElement {
    ider: string[];
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: Utbetaling[];
}

type IntermediateElement = CollapsedUtbetalingshistorikkElement & {
    ider: string[];
    erstattet: boolean;
};

const harDagtyper = (dagtyper: Dagtype[], tidslinje: Utbetalingsdag[]): boolean =>
    !!tidslinje.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (tidslinje: Utbetalingsdag[]): boolean =>
    harDagtyper([Dagtype.Ferie, Dagtype.Arbeidsgiverperiode], tidslinje);

const erstattesAvNeste = (element: IntermediateElement, neste: IntermediateElement) =>
    neste.utbetalinger[0].type === 'UTBETALING' && ['REVURDERING', 'UTBETALING'].includes(element.utbetalinger[0].type);

const fjernErstattedeRader = (rader: UtbetalingshistorikkElement[]) => {
    return rader
        .map((it) => ({ ...it, ider: [it.id], erstattet: false }))
        .reverse()
        .map((rad, index, all) => {
            const nesteRad = all[index + 1];
            if (!nesteRad) return rad;
            if (erstattesAvNeste(rad, nesteRad)) {
                nesteRad.ider = [...nesteRad.ider, ...rad.ider];
                nesteRad.utbetalinger = [...nesteRad.utbetalinger, ...rad.utbetalinger];
                rad.erstattet = true;
            }
            return rad;
        })
        .filter((it) => !it.erstattet)
        .reverse()
        .map((it) => ({
            ider: it.ider,
            beregnettidslinje: it.beregnettidslinje,
            hendelsetidslinje: it.hendelsetidslinje,
            utbetalinger: it.utbetalinger,
        }));
};

const manglerBeregningEllerTilhørerRad = (
    vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode,
    radIder: string[],
    radIndex: number
) => {
    const tilstanderUtenBeregning = [
        Vedtaksperiodetilstand.Venter,
        Vedtaksperiodetilstand.IngenUtbetaling,
        Vedtaksperiodetilstand.VenterPåKiling,
    ];
    return (
        vedtaksperiode.beregningIder?.some((id) => radIder.includes(id)) ||
        (radIndex === 0 && tilstanderUtenBeregning.includes(vedtaksperiode.tilstand))
    );
};

export const toVedtaksperioder = (vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[]) => {
    return (
        vedtaksperioder.map((periode) => {
            return {
                id: periode.id,
                start: periode.fom.toDate(),
                end: periode.tom.toDate(),
                tilstand: periode.tilstand,
                utbetalingstype: 'utbetaling',
                skalVisePin: periode.utbetalingstidslinje && skalViseInfoPin(periode.utbetalingstidslinje),
                hoverLabel: <HoverInfo vedtaksperiode={periode} />,
            };
        }) ?? []
    );
};

export const toTidslinjeperioder = (
    element: CollapsedUtbetalingshistorikkElement,
    fom: Dayjs,
    tom: Dayjs,
    arbeidsgiver: Arbeidsgiver,
    radIndex: number
): TidslinjeperiodeObject[] => {
    const vedtaksperioder = toVedtaksperioder(
        arbeidsgiver.vedtaksperioder.filter((it) => manglerBeregningEllerTilhørerRad(it, element.ider, radIndex))
    );

    const perioder = new PerioderBuilder().build(element, vedtaksperioder).map((periode) => {
        const begrensetTidslinje = element.utbetalinger[0].utbetalingstidslinje.filter(
            ({ dato }) => dato.isSameOrAfter(periode.fom) && dato.isSameOrBefore(periode.tom)
        );
        return {
            id: element.ider[element.ider.length - 1],
            start: periode.fom,
            end: periode.tom,
            tilstand: Vedtaksperiodetilstand.Oppgaver,
            utbetalingstype: 'revurdering',
            skalVisePin: radIndex === 0 && skalViseInfoPin(begrensetTidslinje),
        };
    });

    return getPositionedPeriods(
        fom.toDate(),
        tom.toDate(),
        [...perioder, ...vedtaksperioder],
        'right'
    ) as TidslinjeperiodeObject[];
};

const harUtbetalingshistorikk = (utbetalingshistorikk: UtbetalingshistorikkElement[]) =>
    utbetalingshistorikk.length > 0;

export const useTidslinjerader = (
    person: Person,
    fom: Dayjs,
    tom: Dayjs,
    skalAnonymisereData: boolean
): { id: string; navn: string; rader: TidslinjeradObject[] }[] =>
    useMemo(
        () =>
            person.arbeidsgivere.map((arbeidsgiver) => {
                return {
                    id: arbeidsgiver.organisasjonsnummer,
                    navn: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                    rader: harUtbetalingshistorikk(arbeidsgiver.utbetalingshistorikk)
                        ? fjernErstattedeRader(arbeidsgiver.utbetalingshistorikk).map(
                              (element, radIndex) =>
                                  ({
                                      id: nanoid(),
                                      perioder: toTidslinjeperioder(element, fom, tom, arbeidsgiver, radIndex),
                                      arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                                      erAktiv: false,
                                      radtype: element.utbetalinger[0].type,
                                  } as TidslinjeradObject)
                          )
                        : [
                              {
                                  id: nanoid(),
                                  perioder: getPositionedPeriods(
                                      fom.toDate(),
                                      tom.toDate(),
                                      toVedtaksperioder(arbeidsgiver.vedtaksperioder),
                                      'right'
                                  ) as TidslinjeperiodeObject[],
                                  arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                                  erAktiv: false,
                                  radtype: 'UTBETALING',
                              },
                          ],
                };
            }),
        [person, fom, tom]
    );
