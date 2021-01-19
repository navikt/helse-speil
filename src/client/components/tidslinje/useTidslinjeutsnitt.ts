import { Tidslinjeutsnitt } from './Tidslinje.types';
import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Person } from 'internal-types';

type EnkelPeriode = { fom: Dayjs; tom: Dayjs };

const senesteDato = (perioder: EnkelPeriode[]) =>
    perioder
        .reduce((senesteDato, periode) => (periode.tom.isAfter(senesteDato) ? periode.tom : senesteDato), dayjs(0))
        .endOf('day') ?? dayjs().endOf('day');

export const useTidslinjeutsnitt = (person?: Person) => {
    const sisteDato = useMemo(() => {
        const vedtaksperioder = person?.arbeidsgivere.flatMap(({ vedtaksperioder }) => vedtaksperioder);
        const infotrygdutbetalinger = person?.infotrygdutbetalinger;
        const senesteVedtaksperiodedato = senesteDato(vedtaksperioder as EnkelPeriode[]);
        const senesteInfotrygdperiodedato = senesteDato(infotrygdutbetalinger as EnkelPeriode[]);
        return senesteInfotrygdperiodedato.isAfter(senesteVedtaksperiodedato)
            ? senesteInfotrygdperiodedato
            : senesteVedtaksperiodedato;
    }, [person]);

    const utsnitt: Tidslinjeutsnitt[] = [
        {
            fom: sisteDato.subtract(6, 'month'),
            tom: sisteDato,
            label: '6 mnd',
        },
        {
            fom: sisteDato.subtract(1, 'year'),
            tom: sisteDato,
            label: '1 år',
        },
        {
            fom: sisteDato.subtract(4, 'year'),
            tom: sisteDato,
            label: '4 år',
        },
    ];

    const [aktivtUtsnitt, setAktivtUtsnitt] = useState<number>(0);

    return { utsnitt: utsnitt, aktivtUtsnitt: aktivtUtsnitt, setAktivtUtsnitt: setAktivtUtsnitt };
};
