import { Tidslinjevindu } from './Tidslinje.types';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Person } from '../../context/types.internal';

export const useTidslinjevinduer = (person?: Person) => {
    const sisteDato = useMemo(
        () =>
            person?.arbeidsgivere
                .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
                .reduce(
                    (senesteDato, periode) => (periode.tom.isAfter(senesteDato) ? periode.tom : senesteDato),
                    dayjs(0)
                )
                .endOf('day') ?? dayjs().endOf('day'),
        [person]
    );

    const vinduer: Tidslinjevindu[] = [
        {
            fom: sisteDato.subtract(6, 'month'),
            tom: sisteDato,
            label: '6 mnd'
        },
        {
            fom: sisteDato.subtract(1, 'year'),
            tom: sisteDato,
            label: '1 år'
        },
        {
            fom: sisteDato.subtract(3, 'year'),
            tom: sisteDato,
            label: '3 år'
        }
    ];

    const [aktivtVindu, setAktivtVindu] = useState<number>(0);

    return { vinduer, aktivtVindu, setAktivtVindu };
};
