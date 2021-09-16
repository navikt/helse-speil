import { Dayjs } from 'dayjs';
import { Dagtype, Overstyring, OverstyrtDag, Utbetalingsdag } from 'internal-types';
import { useMemo } from 'react';

import { Tidslinjeperiode } from '../../../../modell/utbetalingshistorikkelement';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const mapKey = (dag: Utbetalingsdag): string => dag.dato.format(NORSK_DATOFORMAT);

export const withDagerIgjen = (dager: Utbetalingsdag[], totaltAntallDagerIgjen: number): UtbetalingstabellDag[] => {
    const getDagerIgjen = (dag: Utbetalingsdag, dagerIgjen: number) =>
        dag.type === Dagtype.Syk && dagerIgjen > 0 ? dagerIgjen - 1 : dagerIgjen;

    return dager.length > 0
        ? (dager
              .slice(1)
              .reduce((alle, it, i) => alle.concat([{ ...it, dagerIgjen: getDagerIgjen(it, alle[i].dagerIgjen) }]), [
                  { ...dager[0], dagerIgjen: getDagerIgjen(dager[0], totaltAntallDagerIgjen) },
              ]) as UtbetalingstabellDag[])
        : [];
};

export const antallSykedagerTilOgMedMaksdato = (dager: Utbetalingsdag[], maksdato?: Dayjs): number =>
    maksdato ? dager.filter((it) => it.type === Dagtype.Syk && it.dato.isSameOrBefore(maksdato)).length : 0;

export const useTabelldagerMap = (
    periode: Tidslinjeperiode,
    overstyringer: Overstyring[],
    gjenståendeDager: number,
    maksdato?: Dayjs
): Map<string, UtbetalingstabellDag> =>
    useMemo(() => {
        const antallDagerIgjen =
            gjenståendeDager + antallSykedagerTilOgMedMaksdato(periode.utbetalingstidslinje, maksdato);

        const dager: UtbetalingstabellDag[] = withDagerIgjen(periode.utbetalingstidslinje, antallDagerIgjen).map(
            (it, i) => ({
                ...it,
                sykdomsdag: {
                    kilde: periode.sykdomstidslinje[i].kilde,
                    type: periode.sykdomstidslinje[i].type,
                },
            })
        ) as UtbetalingstabellDag[];

        const dagerMap: Map<string, UtbetalingstabellDag> = new Map(dager.map((it) => [mapKey(it), it]));

        overstyringer.forEach((overstyring: Overstyring) => {
            overstyring.overstyrteDager.forEach((dag: OverstyrtDag) => {
                const existing = dagerMap.get(dag.dato.format(NORSK_DATOFORMAT));
                if (existing) {
                    dagerMap.set(dag.dato.format(NORSK_DATOFORMAT), {
                        ...existing,
                        isMaksdato: (maksdato && dag.dato.isSame(maksdato)) ?? false,
                        overstyring: {
                            begrunnelse: overstyring.begrunnelse,
                            ident: overstyring.saksbehandlerIdent,
                            navn: overstyring.saksbehandlerNavn,
                            timestamp: overstyring.timestamp,
                        },
                    });
                }
            });
        });

        return dagerMap;
    }, [periode, overstyringer, gjenståendeDager, maksdato]);
