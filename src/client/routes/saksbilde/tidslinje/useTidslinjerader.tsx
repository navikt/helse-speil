import { Dayjs } from 'dayjs';
import {
    Dagtype,
    Person,
    Revurderingtilstand,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';

import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';
import { PeriodObject } from '@navikt/helse-frontend-timeline/src/components/types';

import {
    Periodetype,
    Tidslinjeperiode,
    UtbetalingshistorikkElement,
    Utbetalingstatus,
} from '../../../modell/UtbetalingshistorikkElement';

import { HoverInfo, TidslinjeperiodeHoverInfo } from './HoverInfo';
import { arbeidsgiverNavn } from './Tidslinje';
import { TidslinjeperiodeObject } from './Tidslinje.types';

export type TidslinjeradObject = {
    id: string;
    perioder: TidslinjeperiodeObject[];
    arbeidsgiver: string;
    erAktiv: boolean;
};

const harDagtyper = (dagtyper: Dagtype[], tidslinje: Utbetalingsdag[]): boolean =>
    !!tidslinje.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (tidslinje: Utbetalingsdag[]): boolean =>
    harDagtyper([Dagtype.Ferie, Dagtype.Arbeidsgiverperiode, Dagtype.Permisjon], tidslinje);

const tilstand = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): Vedtaksperiodetilstand | string => {
    if ((vedtaksperiode as Vedtaksperiode).automatiskBehandlet) {
        return vedtaksperiode.tilstand === Vedtaksperiodetilstand.TilUtbetaling
            ? 'tilUtbetalingAutomatisk'
            : vedtaksperiode.tilstand === Vedtaksperiodetilstand.Utbetalt
            ? 'utbetaltAutomatisk'
            : vedtaksperiode.tilstand;
    } else {
        return vedtaksperiode.tilstand;
    }
};

export const toVedtaksperioder = (vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[]): PeriodObject[] => {
    return (
        vedtaksperioder.map((periode) => {
            return {
                id: periode.id,
                start: periode.fom.toDate(),
                end: periode.tom.toDate(),
                tilstand: tilstand(periode),
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

export const tilPeriodetilstand = (status: Utbetalingstatus, type: Periodetype) => {
    switch (type) {
        case Periodetype.REVURDERING:
            switch (status) {
                case Utbetalingstatus.IKKE_UTBETALT:
                    return Revurderingtilstand.Revurderes;
                case Utbetalingstatus.UTBETALT:
                    return Revurderingtilstand.Revurdert;
                case Utbetalingstatus.INGEN_UTBETALING:
                case Utbetalingstatus.UKJENT:
                    return Revurderingtilstand.Ukjent;
            }
            break;
        case Periodetype.UFULLSTENDIG:
            return Vedtaksperiodetilstand.Venter;
        default:
            return toVedtaksperiodetilstand(status);
    }
};

export const toTidslinjeperioder = (
    tidslinjeperioder: Tidslinjeperiode[],
    fom: Dayjs,
    tom: Dayjs
): TidslinjeperiodeObject[] => {
    const perioder = tidslinjeperioder.map((it) => {
        return {
            id: `${it.id}+${it.beregningId}+${it.unique}`,
            start: it.fom.toDate(),
            end: it.tom.toDate(),
            tilstand: tilPeriodetilstand(it.tilstand, it.type),
            utbetalingstype: it.type.toString().toLowerCase(),
            skalVisePin: it.utbetalingstidslinje && skalViseInfoPin(it.utbetalingstidslinje),
            hoverLabel: <TidslinjeperiodeHoverInfo tidslinjeperiode={it} />,
        };
    });

    return getPositionedPeriods(fom.toDate(), tom.toDate(), perioder, 'right') as TidslinjeperiodeObject[];
};

const harUtbetalingshistorikk = (utbetalingshistorikk: UtbetalingshistorikkElement[]) =>
    utbetalingshistorikk.length > 0;

export const useTidslinjerader = (
    person: Person,
    fom: Dayjs,
    tom: Dayjs,
    skalAnonymisereData: boolean
): { id: string; navn: string; rader: TidslinjeradObject[] }[] => {
    return useMemo(
        () =>
            person.arbeidsgivere.map((arbeidsgiver) => {
                return {
                    id: arbeidsgiver.organisasjonsnummer,
                    navn: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                    rader: harUtbetalingshistorikk(arbeidsgiver.utbetalingshistorikk)
                        ? arbeidsgiver.tidslinjeperioder.map(
                              (rad) =>
                                  ({
                                      id: nanoid(),
                                      perioder: toTidslinjeperioder(rad, fom, tom),
                                      arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                                      erAktiv: false,
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
                              },
                          ],
                };
            }),
        [person, fom, tom]
    );
};
