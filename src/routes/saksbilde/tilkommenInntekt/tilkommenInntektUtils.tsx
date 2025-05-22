import { ReactElement } from 'react';

import { ArbeidsgiverFragment, PersonFragment, Utbetalingsdagtype } from '@io/graphql';
import { IconArbeidsdag } from '@saksbilde/table/icons/IconArbeidsdag';
import { IconFailure } from '@saksbilde/table/icons/IconFailure';
import { IconFerie } from '@saksbilde/table/icons/IconFerie';
import { IconSyk } from '@saksbilde/table/icons/IconSyk';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { DatePeriod, DateString } from '@typer/shared';
import { tilDatoer, tilUkedager } from '@utils/date';

export function utledSykefraværstilfelleperioder(person: PersonFragment): DatePeriod[] {
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
                    acc[key] = { fom: periode.fom, tom: periode.tom };
                } else {
                    if (periode.fom < acc[key].fom) {
                        acc[key].fom = periode.fom;
                    }
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
    dagtypePerOrganisasjonsnummer: Map<string, Utbetalingsdagtype>;
};

export type DagtypeTabell = {
    kolonneDefinisjoner: DagtypeKolonneDefinisjon[];
    rader: DagtypeRad[];
};

export const tilDagtypeTabell = (periode: DatePeriod, arbeidsgivere: ArbeidsgiverFragment[]): DagtypeTabell => {
    const datoer = tilDatoer(periode);

    const kolonneDefinisjoner: DagtypeKolonneDefinisjon[] = [];
    const datoOrganisasjonsnummerDagtypeMap = new Map<DateString, Map<string, Utbetalingsdagtype>>();
    datoer.forEach((dato) => datoOrganisasjonsnummerDagtypeMap.set(dato, new Map<string, Utbetalingsdagtype>()));

    arbeidsgivere.forEach((arbeidsgiver) => {
        const utbetalingsdager =
            arbeidsgiver.generasjoner[0]?.perioder.flatMap((p) => {
                return p.tidslinje
                    .filter((dag) => datoer.includes(dag.dato))
                    .map((dag) => {
                        return { dato: dag.dato, dagtype: dag.utbetalingsdagtype };
                    });
            }) ?? [];
        if (utbetalingsdager.length > 0) {
            kolonneDefinisjoner.push({
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                navn: arbeidsgiver.navn,
            });
            utbetalingsdager.forEach((dag) =>
                datoOrganisasjonsnummerDagtypeMap.get(dag.dato)!.set(arbeidsgiver.organisasjonsnummer, dag.dagtype),
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

export const dekorerTekst = (dagtype: Utbetalingsdagtype, erHelg: boolean): string => {
    switch (dagtype) {
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return 'Avslått';
        case Utbetalingsdagtype.Arbeidsgiverperiodedag:
            return erHelg ? 'Helg (AGP)' : 'Syk (AGP)';
        case Utbetalingsdagtype.Helgedag:
        case Utbetalingsdagtype.Navhelgdag:
            return 'Helg';
        case Utbetalingsdagtype.Feriedag:
            return 'Ferie';
        case Utbetalingsdagtype.Navdag:
            return 'Syk';
        case Utbetalingsdagtype.Arbeidsdag:
            return 'Arbeid';
        case Utbetalingsdagtype.UkjentDag:
        default:
            return 'Ukjent';
    }
};
export const getTypeIcon = (dagtype: Utbetalingsdagtype, erHelg: boolean): ReactElement | null => {
    switch (dagtype) {
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return <IconFailure />;
        case Utbetalingsdagtype.Navdag:
        case Utbetalingsdagtype.Arbeidsgiverperiodedag:
            return erHelg ? null : <IconSyk />;
        case Utbetalingsdagtype.Feriedag:
            return <IconFerie />;
        case Utbetalingsdagtype.Arbeidsdag:
            return <IconArbeidsdag />;
        case Utbetalingsdagtype.Helgedag:
        case Utbetalingsdagtype.Navhelgdag:
        case Utbetalingsdagtype.UkjentDag:
        default:
            return null;
    }
};
