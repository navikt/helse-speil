import { PersonFragment } from '@io/graphql';
import { useTabelldagerMap } from '@saksbilde/utbetaling/utbetalingstabell/useTabelldagerMap';
import { Inntektsforhold, useDagoverstyringer } from '@state/arbeidsgiver';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { DatePeriod, DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { somDato, tilDatoer, tilUkedager } from '@utils/date';
import { getAntallAGPDagerBruktFørPerioden } from '@utils/periode';
import { isArbeidsgiver, isBeregnetPeriode, isSelvstendigNaering, isUberegnetPeriode } from '@utils/typeguards';

export function utledSykefraværstilfelleperioder(person: PersonFragment): DatePeriod[] {
    const vedtaksperioder = finnAlleInntektsforhold(person)
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

export function tilPerioderPerOrganisasjonsnummer(tilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[]) {
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

export type DagtypeKolonneDefinisjon = {
    organisasjonsnummer: string;
    navn: string;
};

export type DagtypeRad = {
    dato: DateString;
    dagtypePerOrganisasjonsnummer: Map<string, Utbetalingstabelldag>;
};

export type DagtypeTabell = {
    kolonneDefinisjoner: DagtypeKolonneDefinisjon[];
    rader: DagtypeRad[];
};

export const tilDagtypeTabell = (periode: DatePeriod, inntektsforhold: Inntektsforhold[]): DagtypeTabell => {
    const datoer = tilDatoer(periode);

    const kolonneDefinisjoner: DagtypeKolonneDefinisjon[] = [];
    const datoOrganisasjonsnummerDagtypeMap = new Map<DateString, Map<string, Utbetalingstabelldag>>();
    datoer.forEach((dato) => datoOrganisasjonsnummerDagtypeMap.set(dato, new Map<string, Utbetalingstabelldag>()));
    const dayjsTom = somDato(periode.tom);
    const dayjsFom = somDato(periode.fom);

    inntektsforhold.forEach((inntektsforholdet) => {
        const dagoverstyringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforholdet);

        const perioder =
            inntektsforholdet.generasjoner[0]?.perioder?.filter(
                (it) => dayjsTom.isSameOrAfter(it.fom) && dayjsFom.isSameOrBefore(it.tom),
            ) ?? [];

        const tabelldagerMaps = perioder
            .filter((periode) => isBeregnetPeriode(periode) || isUberegnetPeriode(periode))
            .map((period) => {
                if (isBeregnetPeriode(period)) {
                    return useTabelldagerMap({
                        tidslinje: period.tidslinje,
                        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforholdet),
                        gjenståendeDager: period.gjenstaendeSykedager,
                        overstyringer: dagoverstyringer,
                        maksdato: period.maksdato,
                    });
                } else {
                    return useTabelldagerMap({
                        tidslinje: period.tidslinje,
                        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforholdet),
                        overstyringer: dagoverstyringer,
                        antallAGPDagerBruktFørPerioden: getAntallAGPDagerBruktFørPerioden(inntektsforholdet, period),
                    });
                }
            });

        const alleTabelldagerMap = new Map<string, Utbetalingstabelldag>();
        tabelldagerMaps.forEach((currentValue) => {
            return currentValue.forEach((value, key) => alleTabelldagerMap.set(key, value));
        });

        if (alleTabelldagerMap.size > 0) {
            kolonneDefinisjoner.push({
                organisasjonsnummer: isArbeidsgiver(inntektsforholdet)
                    ? inntektsforholdet.organisasjonsnummer
                    : 'SELVSTENDIG',
                navn: isArbeidsgiver(inntektsforholdet) ? inntektsforholdet.navn : 'SELVSTENDIG',
            });
            alleTabelldagerMap.forEach((value, key) =>
                datoOrganisasjonsnummerDagtypeMap
                    .get(key)
                    ?.set(
                        isArbeidsgiver(inntektsforholdet) ? inntektsforholdet.organisasjonsnummer : 'SELVSTENDIG',
                        value,
                    ),
            );
        }
    });

    return {
        kolonneDefinisjoner: kolonneDefinisjoner,
        rader: Array.from(datoOrganisasjonsnummerDagtypeMap.entries()).map(
            ([dato, dagtypePerOrganisasjonsnummer]): DagtypeRad => ({
                dato: dato,
                dagtypePerOrganisasjonsnummer: dagtypePerOrganisasjonsnummer,
            }),
        ),
    };
};
