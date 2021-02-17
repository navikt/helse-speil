import {
    Arbeidsgiver,
    Dagtype,
    Person,
    UfullstendigVedtaksperiode,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import React, { useMemo } from 'react';
import { HoverInfo } from './HoverInfo';
import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/src/components/calc';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { Dayjs } from 'dayjs';
import { arbeidsgiverNavn } from './Tidslinje';

const harDagtyper = (dagtyper: Dagtype[], periode: Vedtaksperiode | UfullstendigVedtaksperiode): boolean =>
    !!periode.utbetalingstidslinje?.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): boolean =>
    harDagtyper([Dagtype.Ferie, Dagtype.Arbeidsgiverperiode], vedtaksperiode);

const status = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): Vedtaksperiodetilstand | string => {
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

export type TidslinjeradObject = {
    id: string;
    perioder: TidslinjeperiodeObject[];
    arbeidsgiver: string;
    erAktiv: boolean;
};

export const useTidslinjerader = (
    person: Person,
    fom: Dayjs,
    tom: Dayjs,
    skalAnonymisereData: boolean,
    aktivVedtaksperiode?: Vedtaksperiode
): TidslinjeradObject[] =>
    useMemo(
        () =>
            person.arbeidsgivere.map((it) => {
                const perioder = it.vedtaksperioder.map((it: Vedtaksperiode | UfullstendigVedtaksperiode) => ({
                    id: it.id,
                    start: it.fom.toDate(),
                    end: it.tom.toDate(),
                    tilstand: status(it),
                    hoverLabel: <HoverInfo vedtaksperiode={it} />,
                    skalVisePin: skalViseInfoPin(it),
                }));

                const posisjonertePerioder = getPositionedPeriods(
                    fom.toDate(),
                    tom.toDate(),
                    perioder,
                    'right'
                ) as TidslinjeperiodeObject[];

                return {
                    id: it.organisasjonsnummer,
                    perioder: posisjonertePerioder,
                    arbeidsgiver: arbeidsgiverNavn(it, skalAnonymisereData),
                    erAktiv: perioder.find((it) => it.id === aktivVedtaksperiode?.id) !== undefined,
                };
            }) ?? [],
        [person, aktivVedtaksperiode, fom, tom, skalAnonymisereData]
    );
