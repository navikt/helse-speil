import { Utbetaling, UtbetalingshistorikkElement } from '../../../types/types.tidslinjer';
import {
    Arbeidsgiver,
    Person,
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import { useMemo } from 'react';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { arbeidsgiverNavn } from './Tidslinje';
import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';
import { PerioderBuilder } from './perioderBuilder';
import { Dayjs } from 'dayjs';

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

const skalErstatteNeste = (element: IntermediateElement, neste: IntermediateElement) => {
    return (
        element.utbetalinger[0].type === 'UTBETALING' &&
        ['REVURDERING', 'UTBETALING'].includes(neste.utbetalinger[0].type)
    );
};

const fjernOverflødigeRader = (rader: UtbetalingshistorikkElement[]) => {
    return rader
        .map((it) => ({ ...it, ider: [it.id], erstattet: false }))
        .map((rad, index, all) => {
            const nesteRad = all[index + 1];
            if (!nesteRad) return rad;
            if (skalErstatteNeste(rad, nesteRad)) {
                rad.ider = [rad.id, nesteRad.id];
                nesteRad.erstattet = true;
            }
            return rad;
        })
        .filter((it) => !it.erstattet)
        .map((it) => ({
            ider: it.ider,
            beregnettidslinje: it.beregnettidslinje,
            hendelsetidslinje: it.hendelsetidslinje,
            utbetalinger: it.utbetalinger,
        }));
};

const venterEllerTilhørerRad = (
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

export const toTidslinjeperioder = (
    element: CollapsedUtbetalingshistorikkElement,
    fom: Dayjs,
    tom: Dayjs,
    arbeidsgiver: Arbeidsgiver,
    radIndex: number
): TidslinjeperiodeObject[] => {
    const vedtaksperioder =
        arbeidsgiver.vedtaksperioder
            .filter((it) => venterEllerTilhørerRad(it, element.ider, radIndex))
            .map((periode) => {
                return {
                    id: periode.id,
                    start: periode.fom.toDate(),
                    end: periode.tom.toDate(),
                    tilstand: periode.tilstand,
                    skalVisePin: false,
                };
            }) ?? [];

    const perioder = new PerioderBuilder().build(element, vedtaksperioder).map((periode) => {
        return {
            id: element.ider[element.ider.length - 1],
            start: periode.fom,
            end: periode.tom,
            tilstand: Vedtaksperiodetilstand.Ukjent,
            skalVisePin: false,
        };
    });

    return getPositionedPeriods(
        fom.toDate(),
        tom.toDate(),
        [...perioder, ...vedtaksperioder],
        'right'
    ) as TidslinjeperiodeObject[];
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
                    rader: fjernOverflødigeRader(arbeidsgiver.utbetalingshistorikk).map(
                        (element, radIndex) =>
                            ({
                                id: element.ider[element.ider.length - 1],
                                perioder: toTidslinjeperioder(element, fom, tom, arbeidsgiver, radIndex),
                                arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                                erAktiv: false,
                                radtype: element.utbetalinger[0].type,
                            } as TidslinjeradObject)
                    ),
                };
            }),
        [person, fom, tom]
    );
