import { PersonFragment } from '@io/graphql';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { useTabelldagerMap } from '@saksbilde/utbetaling/utbetalingstabell/useTabelldagerMap';
import {
    Inntektsforhold,
    InntektsforholdReferanse,
    finnAlleInntektsforhold,
    inntektsforholdReferanseTilKey,
    tilReferanse,
    useDagoverstyringer,
} from '@state/inntektsforhold/inntektsforhold';
import { DatePeriod, DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { somDato, tilDatoer, tilUkedager } from '@utils/date';
import { getAntallAGPDagerBruktFørPerioden } from '@utils/periode';
import { isBeregnetPeriode, isSelvstendigNaering, isUberegnetPeriode } from '@utils/typeguards';

export function utledSykefraværstilfelleperioder(person: PersonFragment): DatePeriod[] {
    const vedtaksperioder = finnAlleInntektsforhold(person)
        .flatMap((ag) => ag.behandlinger[0]?.perioder)
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
                    acc[key] = { fom: periode.skjæringstidspunkt, tom: periode.tom };
                } else {
                    if (periode.tom > acc[key].tom) {
                        acc[key].tom = periode.tom;
                    }
                }
                return acc;
            },
            {} as Record<string, DatePeriod>,
        ),
    );
}

export function tilPerioderPerOrganisasjonsnummer(tilkomneInntekter: ApiTilkommenInntekt[]) {
    const map = new Map<string, DatePeriod[]>();
    tilkomneInntekter.forEach((tilkommenInntekt) => {
        const liste = map.get(tilkommenInntekt.organisasjonsnummer) ?? [];
        liste.push({ fom: tilkommenInntekt.periode.fom, tom: tilkommenInntekt.periode.tom });
        map.set(tilkommenInntekt.organisasjonsnummer, liste);
    });
    return map;
}

export function beregnInntektPerDag(periodebeløp: number, periode: DatePeriod, ekskluderteUkedager: DateString[]) {
    const antallDagerTilGradering = tilUkedager(periode).filter((dato) => !ekskluderteUkedager.includes(dato)).length;

    return periodebeløp / antallDagerTilGradering;
}

export type DagtypeRad = {
    dato: DateString;
    dagtypePerInntektsforhold: Map<string, Utbetalingstabelldag>;
};

export type DagtypeTabell = {
    inntektsforholdReferanser: InntektsforholdReferanse[];
    rader: DagtypeRad[];
};

export const tilDagtypeTabell = (periode: DatePeriod, alleInntektsforhold: Inntektsforhold[]): DagtypeTabell => {
    const datoer = tilDatoer(periode);

    const inntektsforholdReferanser: InntektsforholdReferanse[] = [];
    const datoInntektsforholdDagtypeMap = new Map<DateString, Map<string, Utbetalingstabelldag>>();
    datoer.forEach((dato) => datoInntektsforholdDagtypeMap.set(dato, new Map<string, Utbetalingstabelldag>()));
    const dayjsTom = somDato(periode.tom);
    const dayjsFom = somDato(periode.fom);

    alleInntektsforhold.forEach((inntektsforhold) => {
        const dagoverstyringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforhold);

        const perioder =
            inntektsforhold.behandlinger[0]?.perioder?.filter(
                (it) => dayjsTom.isSameOrAfter(it.fom) && dayjsFom.isSameOrBefore(it.tom),
            ) ?? [];

        const tabelldagerMaps = perioder
            .filter((periode) => isBeregnetPeriode(periode) || isUberegnetPeriode(periode))
            .map((period) => {
                if (isBeregnetPeriode(period)) {
                    return useTabelldagerMap({
                        tidslinje: period.tidslinje,
                        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforhold),
                        gjenståendeDager: period.gjenstaendeSykedager,
                        overstyringer: dagoverstyringer,
                        maksdato: period.maksdato,
                    });
                } else {
                    return useTabelldagerMap({
                        tidslinje: period.tidslinje,
                        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforhold),
                        overstyringer: dagoverstyringer,
                        antallAGPDagerBruktFørPerioden: getAntallAGPDagerBruktFørPerioden(inntektsforhold, period),
                    });
                }
            });

        const alleTabelldagerMap = new Map<string, Utbetalingstabelldag>();
        tabelldagerMaps.forEach((currentValue) => {
            return currentValue.forEach((value, key) => alleTabelldagerMap.set(key, value));
        });

        if (alleTabelldagerMap.size > 0) {
            inntektsforholdReferanser.push(tilReferanse(inntektsforhold));
            alleTabelldagerMap.forEach((value, key) =>
                datoInntektsforholdDagtypeMap
                    .get(key)
                    ?.set(inntektsforholdReferanseTilKey(tilReferanse(inntektsforhold)), value),
            );
        }
    });

    return {
        inntektsforholdReferanser: inntektsforholdReferanser,
        rader: Array.from(datoInntektsforholdDagtypeMap.entries()).map(
            ([dato, dagtypePerInntektsforhold]): DagtypeRad => ({
                dato: dato,
                dagtypePerInntektsforhold: dagtypePerInntektsforhold,
            }),
        ),
    };
};
