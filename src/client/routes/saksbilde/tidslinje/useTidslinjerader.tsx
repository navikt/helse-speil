import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';

import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';

import { HoverInfo } from './HoverInfo';
import { arbeidsgiverNavn } from './Tidslinje';
import { TidslinjeperiodeObject } from './Tidslinje.types';

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
    tidslinjeperioder: Tidslinjeperiode[],
    fom: Dayjs,
    tom: Dayjs
): TidslinjeperiodeObject[] => {
    const perioder = tidslinjeperioder.map((it) => {
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

    return getPositionedPeriods(fom.toDate(), tom.toDate(), perioder, 'right') as TidslinjeperiodeObject[];
};
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
                    rader: arbeidsgiver.tidslinjeperioder.map(
                        (rad) =>
                            ({
                                id: nanoid(),
                                perioder: toTidslinjeperioder(rad, fom, tom),
                                arbeidsgiver: arbeidsgiverNavn(arbeidsgiver, skalAnonymisereData),
                                erAktiv: false,
                            } as TidslinjeradObject)
                    ),
                };
            }),
        [person, fom, tom]
    );
};
