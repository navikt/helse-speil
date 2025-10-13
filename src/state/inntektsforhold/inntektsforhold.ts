import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    Arbeidsgiver,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    Generasjon,
    Maybe,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { findArbeidsgiverWithGhostPeriode, findArbeidsgiverWithPeriode } from '@state/inntektsforhold/arbeidsgiver';
import { findSelvstendigWithPeriode } from '@state/inntektsforhold/selvstendigNæring';
import { useActivePeriod } from '@state/periode';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { ActivePeriod, DateString } from '@typer/shared';
import {
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isSelvstendigNaering,
    isUberegnetPeriode,
} from '@utils/typeguards';

export type Inntektsforhold = Arbeidsgiver | SelvstendigNaering;

export const useAktivtInntektsforhold = (person: Maybe<PersonFragment>): Inntektsforhold | undefined => {
    const aktivPeriode = useActivePeriod(person);
    return finnInntektsforholdForPeriode(person, aktivPeriode);
};

export const finnAlleInntektsforhold = (person: Maybe<PersonFragment>): Inntektsforhold[] => {
    const selvstendig: SelvstendigNaering[] =
        person?.selvstendigNaering != undefined ? [person.selvstendigNaering] : [];
    const arbeidsgivere: Arbeidsgiver[] =
        person?.arbeidsgivere.filter((arbeidsgiver) => arbeidsgiver.organisasjonsnummer !== 'SELVSTENDIG') ?? [];
    return [...selvstendig, ...arbeidsgivere];
};
export const finnInntektsforholdForPeriode = (
    person: Maybe<PersonFragment>,
    periode: Maybe<ActivePeriod>,
): Inntektsforhold | undefined => {
    if (!periode || !person) return undefined;
    if (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) {
        return (
            findSelvstendigWithPeriode(periode, person.selvstendigNaering) ??
            findArbeidsgiverWithPeriode(periode, person.arbeidsgivere) ??
            undefined
        );
    } else if (isGhostPeriode(periode)) {
        return findArbeidsgiverWithGhostPeriode(periode, person.arbeidsgivere) ?? undefined;
    }
    return undefined;
};

export const useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning = (person: PersonFragment): boolean => {
    const aktivPeriode = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    if (!aktivPeriode || !inntektsforhold) return false;

    const generasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, inntektsforhold);

    if (!aktivPeriode || generasjon?.id !== inntektsforhold.generasjoner[0]?.id) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    inntektsforhold?: Maybe<Inntektsforhold>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!inntektsforhold) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return inntektsforhold.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [inntektsforhold, fom, tom]);
};

export const useHarDagOverstyringer = (
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    person: PersonFragment,
): boolean => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforhold);

    if (!inntektsforhold) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, inntektsforhold) && (dagendringer?.length ?? 0) > 0;
};

export const finnPeriodeTilGodkjenning = (person: Maybe<PersonFragment>): Maybe<BeregnetPeriodeFragment> => {
    if (!person) return null;

    return (
        (finnAlleInntektsforhold(person)
            ?.flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder)
            .filter(
                (periode) => isBeregnetPeriode(periode) && periode.periodetilstand === 'TilGodkjenning',
            )?.[0] as BeregnetPeriodeFragment) ?? null
    );
};

export type ArbeidsgiverReferanse = {
    type: 'Arbeidsgiver';
    organisasjonsnummer: string;
    navn?: string;
};

export type SelvstendigNæringReferanse = {
    type: 'Selvstendig Næring';
};

export const finnGenerasjonerForAktivPeriode = (periode: ActivePeriod, person: PersonFragment): Generasjon[] => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(periode, person.arbeidsgivere);
    const selvstendig = findSelvstendigWithPeriode(periode, person.selvstendigNaering);

    if (arbeidsgiver?.organisasjonsnummer === 'SELVSTENDIG') {
        return selvstendig?.generasjoner ?? [];
    }
    return arbeidsgiver?.generasjoner ?? [];
};
export const finnOverstyringerForAktivInntektsforhold = (aktivPeriode: ActivePeriod, person: Maybe<PersonFragment>) => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(aktivPeriode, person?.arbeidsgivere ?? []);
    const selvstendig = findSelvstendigWithPeriode(aktivPeriode, person?.selvstendigNaering ?? null);

    const arbeidsgiverOverstyringer =
        arbeidsgiver?.organisasjonsnummer === 'SELVSTENDIG' ? [] : (arbeidsgiver?.overstyringer ?? []);
    const selvstendigOverstyringer = selvstendig?.overstyringer ?? [];
    return [...arbeidsgiverOverstyringer, ...selvstendigOverstyringer];
};
/**
 * Henter forrige (eldre) generasjon relativt til generasjonen som inneholder den oppgitte perioden.
 *
 * Generasjoner er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * @param periode Perioden som identifiserer aktiv generasjon.
 * @param inntektsforhold Arbeidsgiver som eier generasjonene.
 * @returns Forrige generasjon hvis perioden finnes, nyeste hvis ikke, ellers `null`.
 */
export const finnForrigeEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
): Maybe<Generasjon> => finnNteEllerNyesteGenerasjon(periode, inntektsforhold, 1);
/**
 * Henter en generasjon relativt til generasjonen som inneholder den oppgitte perioden.
 *
 * Generasjoner er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * Regler:
 * 1. Finn generasjonen som inneholder perioden (matcher `id` i beregnet eller uberegnet perioder).
 * 2. Hvis ingen generasjon inneholder perioden: returnerer alltid nyeste generasjon (indeks 0), eller `null` hvis ingen finnes (parameter \`n\` ignoreres i dette tilfellet).
 * 3. Hvis generasjon finnes: returner generasjonen med offset \`n\` (aktiv = 0, eldre = 1, nyere = -1 osv.). Faller utenfor indeks -> `null`.
 *
 * @internal
 * @param periode Perioden som identifiserer aktiv generasjon.
 * @param inntektsforhold Arbeidsgiver som eier generasjonene.
 * @param n Offset: 0 = aktiv, 1 = forrige (eldre), -1 = neste (nyere), >1 flere steg tilbake, <-1 flere steg frem.
 * @returns Generasjonen bestemt av offset, nyeste hvis aktiv ikke finnes, eller `null`.
 */
export const finnNteEllerNyesteGenerasjon = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
    n: number = 0,
): Maybe<Generasjon> => {
    const aktivGenerasjonIndex = inntektsforhold.generasjoner.findIndex((g) =>
        g.perioder.some((p) => isBeregnetPeriode(periode) && p.id === periode.id),
    );
    return (
        (aktivGenerasjonIndex < 0
            ? inntektsforhold.generasjoner[0]
            : inntektsforhold.generasjoner[aktivGenerasjonIndex + n]) ?? null
    );
};

export type InntektsforholdReferanse = ArbeidsgiverReferanse | SelvstendigNæringReferanse;

export const tilReferanse = (inntektsforhold: Inntektsforhold): InntektsforholdReferanse =>
    isSelvstendigNaering(inntektsforhold)
        ? { type: 'Selvstendig Næring' }
        : {
              type: 'Arbeidsgiver',
              organisasjonsnummer: inntektsforhold.organisasjonsnummer,
              navn: inntektsforhold.navn,
          };
