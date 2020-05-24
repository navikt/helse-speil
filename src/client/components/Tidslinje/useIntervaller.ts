import { EnkelSykepengetidslinje } from '@navikt/helse-frontend-tidslinje/dist/components/sykepengetidslinje/Sykepengetidslinje';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { Vedtaksperiode } from '../../context/types.internal';

export interface Intervall {
    id: string;
    fom: Date;
    tom: Date;
    active?: boolean;
}

const senesteIntervall = (a: Intervall, b: Intervall): number => b.tom.getMilliseconds() - a.tom.getMilliseconds();

const toLikeIntervaller = (i1: Intervall, i2: Intervall) => i1.fom === i2.fom && i1.tom === i2.tom;

const identiskeIntervaller = (intervallet: Intervall, i: number, intervallene: Intervall[]): boolean =>
    intervallene.slice(0, i).find((other) => toLikeIntervaller(intervallet, other)) === undefined;

export const useIntervaller = (rader: EnkelSykepengetidslinje[], aktivPeriode?: Vedtaksperiode): Intervall[] =>
    useMemo(() => {
        const perioder = rader.flatMap((rad) => rad.perioder);
        return perioder
            .sort(senesteIntervall)
            .filter(identiskeIntervaller)
            .map((intervallet) => ({
                id: uuid(),
                fom: intervallet.fom,
                tom: intervallet.tom,
                active:
                    aktivPeriode &&
                    aktivPeriode.fom.toDate().getTime() === intervallet.fom.getTime() &&
                    aktivPeriode.tom.toDate().getTime() === intervallet.tom.getTime(),
            }));
    }, [rader, aktivPeriode]);
