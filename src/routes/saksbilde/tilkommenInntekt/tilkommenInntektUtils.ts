import dayjs, { Dayjs } from 'dayjs';

import { PersonFragment, TilkommenInntektskilde } from '@io/graphql';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT, erHelg } from '@utils/date';

export function utledSykefraværstilfeller(person: PersonFragment) {
    const vedtaksperioder = person.arbeidsgivere
        .flatMap((ag) => ag.generasjoner[0]?.perioder)
        .filter((periode) => periode != null)
        .map((periode) => ({
            fom: periode.fom,
            tom: periode.tom,
            skjæringstidspunkt: periode.skjaeringstidspunkt,
        }));

    return Object.values(
        vedtaksperioder.reduce(
            (acc, periode) => {
                const key = periode.skjæringstidspunkt;
                if (!acc[key]) {
                    acc[key] = { ...periode };
                } else {
                    acc[key].fom = acc[key].fom < periode.fom ? acc[key].fom : periode.fom;
                    acc[key].tom = acc[key].tom > periode.tom ? acc[key].tom : periode.tom;
                }
                return acc;
            },
            {} as Record<string, { fom: string; tom: string; skjæringstidspunkt: string }>,
        ),
    );
}

export function lagEksisterendePerioder(tilkommeneInntektskilder: TilkommenInntektskilde[]) {
    const map = new Map<string, { fom: string; tom: string }[]>();
    tilkommeneInntektskilder.forEach((inntektskilde) =>
        map.set(
            inntektskilde.organisasjonsnummer,
            inntektskilde.inntekter.map((inntekt) => ({
                fom: inntekt.periode.fom,
                tom: inntekt.periode.tom,
            })),
        ),
    );
    return map;
}

export function lagDatoIntervall(fom: string, tom: string): Dayjs[] {
    const datoIntervall: Dayjs[] = [];
    let gjeldendeDag = dayjs(fom);

    while (gjeldendeDag.isSameOrBefore(dayjs(tom))) {
        datoIntervall.push(gjeldendeDag);
        gjeldendeDag = gjeldendeDag.add(1, 'day');
    }

    return datoIntervall;
}

export const filtrerDager = (datoIntervall: Dayjs[], dagerSomSkalEkskluderes: DateString[]) => {
    return datoIntervall
        .filter((dag) => !erHelg(dag.format(ISO_DATOFORMAT)))
        .filter((dag) => !dagerSomSkalEkskluderes.includes(dag.format(ISO_DATOFORMAT)));
};
