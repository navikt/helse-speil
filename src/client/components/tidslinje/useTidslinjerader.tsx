import { Utbetaling } from '../../../types/types.tidslinjer';
import {
    Dagtype,
    Person,
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import React, { useMemo } from 'react';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { arbeidsgiverNavn } from './Tidslinje';
import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';
import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import { HoverInfo } from './HoverInfo';
import {
    Tidslinjeperiode,
    UtbetalingshistorikkElement,
    Utbetalingstatus,
} from '../../modell/UtbetalingshistorikkElement';

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

const harDagtyper = (dagtyper: Dagtype[], tidslinje: Utbetalingsdag[]): boolean =>
    !!tidslinje.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (tidslinje: Utbetalingsdag[]): boolean =>
    harDagtyper([Dagtype.Ferie, Dagtype.Arbeidsgiverperiode], tidslinje);

const inngårINyereHistorikk = (element: Historikkelement, neste?: Historikkelement) =>
    neste && neste.utbetalinger[neste.utbetalinger.length - 1].type === 'UTBETALING';

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

const toVedtaksperiodetilstand = (utbetalingstatus: Utbetalingstatus) => {
    switch (utbetalingstatus) {
        case Utbetalingstatus.UTBETALT:
            return Vedtaksperiodetilstand.Utbetalt;
        case Utbetalingstatus.IKKE_UTBETALT:
            return Vedtaksperiodetilstand.Oppgaver;
        case Utbetalingstatus.INGEN_UTBETALING:
            return Vedtaksperiodetilstand.IngenUtbetaling;
        case Utbetalingstatus.UKJENT:
            return Vedtaksperiodetilstand.Ukjent;
    }
};

export const toTidslinjeperioder = (element: Historikkelement, fom: Dayjs, tom: Dayjs): TidslinjeperiodeObject[] => {
    const perioder = element.perioder.map((it) => ({
        id: it.id,
        start: it.fom.toDate(),
        end: it.tom.toDate(),
        tilstand: toVedtaksperiodetilstand(it.tilstand), // IKKE_UTBETALT, UTBETALT, INGEN_UTBETALING
        utbetalingstype: it.type.toString().toLowerCase(),
        skalVisePin: false,
    }));

    return getPositionedPeriods(fom.toDate(), tom.toDate(), perioder, 'right') as TidslinjeperiodeObject[];
};

const harUtbetalingshistorikk = (utbetalingshistorikk: UtbetalingshistorikkElement[]) =>
    utbetalingshistorikk.length > 0;

interface Historikkelement {
    id: string;
    perioder: Tidslinjeperiode[];
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetalinger: Utbetaling[];
}

const tilHistorikkelement = (element: UtbetalingshistorikkElement): Historikkelement => {
    return {
        id: element.id,
        perioder: element.perioder,
        beregnettidslinje: element.beregnettidslinje,
        hendelsetidslinje: element.hendelsetidslinje,
        utbetalinger: element.utbetalinger,
    };
};

const fjernOverlappende = (utbetalingshistorikk: UtbetalingshistorikkElement[]): Historikkelement[] => {
    return utbetalingshistorikk
        .map(tilHistorikkelement)
        .reverse()
        .filter((it, index, alle) => {
            const nesteRad = alle[index + 1];
            if (inngårINyereHistorikk(it, nesteRad)) {
                nesteRad.perioder = [...nesteRad.perioder, ...it.perioder];
                return false;
            }
            return true;
        })
        .reverse();
};

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
                        ? fjernOverlappende(arbeidsgiver.utbetalingshistorikk).map(
                              (element) =>
                                  ({
                                      id: nanoid(),
                                      perioder: toTidslinjeperioder(element, fom, tom),
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
