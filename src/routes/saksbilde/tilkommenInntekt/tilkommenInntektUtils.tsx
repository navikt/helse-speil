import { ReactElement } from 'react';

import { ArbeidsgiverFragment, PersonFragment, Utbetalingsdagtype } from '@io/graphql';
import { IconArbeidsdag } from '@saksbilde/table/icons/IconArbeidsdag';
import { IconFailure } from '@saksbilde/table/icons/IconFailure';
import { IconFerie } from '@saksbilde/table/icons/IconFerie';
import { IconSyk } from '@saksbilde/table/icons/IconSyk';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, plussEnDag } from '@utils/date';

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

export function beregnInntektPerDag(
    periodebeløp: number,
    fom: DateString,
    tom: DateString,
    ekskluderteUkedager: DateString[],
) {
    let antallDagerTilGradering = 0;

    let dag = fom;
    while (dag <= tom) {
        if (!erHelg(dag) && !ekskluderteUkedager.includes(dag)) {
            antallDagerTilGradering++;
        }
        dag = plussEnDag(dag);
    }

    return periodebeløp / antallDagerTilGradering;
}

interface TabellArbeidsdag {
    dato: DateString;
    arbeidsgivere: {
        navn: string;
        dagtype: Utbetalingsdagtype;
    }[];
}

export const tabellArbeidsdager = (arbeidsgivere: ArbeidsgiverFragment[]): TabellArbeidsdag[] => {
    const gruppertPåDato = new Map<DateString, { navn: string; dagtype: Utbetalingsdagtype }[]>();
    const gruppertPåArbeidsgiver: {
        navn: string;
        dager: { dato: DateString; dagtype: Utbetalingsdagtype }[];
    }[] = arbeidsgivere.map((arbeidsgiver) => ({
        navn: arbeidsgiver.navn,
        dager:
            arbeidsgiver.generasjoner[0]?.perioder
                .flatMap((periode) =>
                    periode.tidslinje.map((linje) => ({
                        dato: linje.dato,
                        dagtype: linje.utbetalingsdagtype,
                    })),
                )
                .filter((dag) => dag != null) ?? [],
    }));

    gruppertPåArbeidsgiver.forEach(({ navn, dager }) => {
        dager.forEach(({ dato, dagtype }) => {
            if (!gruppertPåDato.has(dato)) {
                gruppertPåDato.set(dato, []);
            }
            gruppertPåDato.get(dato)?.push({
                navn: navn,
                dagtype: dagtype,
            });
        });
    });

    return Array.from(
        gruppertPåDato.entries().map(([dato, arbeidsgivere]) => ({ dato: dato, arbeidsgivere: arbeidsgivere })),
    );
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
