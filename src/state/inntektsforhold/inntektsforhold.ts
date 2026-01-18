import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    Arbeidsgiver,
    Behandling,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { finnAlleArbeidsgivere, finnArbeidsgiverForGhostPeriode } from '@state/inntektsforhold/arbeidsgiver';
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

export const useAktivtInntektsforhold = (person: PersonFragment | null): Inntektsforhold | undefined => {
    const aktivPeriode = useActivePeriod(person);
    if (!person || !aktivPeriode) return undefined;
    return finnInntektsforholdForPeriode(person, aktivPeriode);
};

export const finnAlleInntektsforhold = (person: PersonFragment | null): Inntektsforhold[] => {
    return [
        ...(person?.selvstendigNaering != undefined ? [person.selvstendigNaering] : []),
        ...finnAlleArbeidsgivere(person),
    ];
};

export const finnInntektsforholdForPeriode = (
    person: PersonFragment,
    periode: ActivePeriod,
): Inntektsforhold | undefined => {
    if (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) {
        return finnAlleInntektsforhold(person).find((inntektsforhold) =>
            inntektsforhold.behandlinger.flatMap((behandling) => behandling.perioder).find((p) => p.id === periode.id),
        );
    }
    if (isGhostPeriode(periode)) {
        return finnArbeidsgiverForGhostPeriode(person, periode);
    }
    return undefined;
};

export const useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning = (person: PersonFragment): boolean => {
    const aktivPeriode = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    if (!aktivPeriode || !inntektsforhold) return false;

    const behandling = finnNteEllerNyesteBehandling(aktivPeriode, inntektsforhold);

    if (!aktivPeriode || behandling?.id !== inntektsforhold.behandlinger[0]?.id) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    inntektsforhold?: Inntektsforhold | null,
): Dagoverstyring[] => {
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

export const finnPeriodeTilGodkjenning = (person: PersonFragment | null): BeregnetPeriodeFragment | null => {
    if (!person) return null;

    return (
        (finnAlleInntektsforhold(person)
            ?.flatMap((arbeidsgiver) => arbeidsgiver.behandlinger[0]?.perioder)
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

export const finnBehandlingerForAktivPeriode = (periode: ActivePeriod, person: PersonFragment): Behandling[] =>
    finnInntektsforholdForPeriode(person, periode)?.behandlinger ?? [];

export const finnOverstyringerForAktivInntektsforhold = (aktivPeriode: ActivePeriod, person: PersonFragment) =>
    finnInntektsforholdForPeriode(person, aktivPeriode)?.overstyringer ?? [];
/**
 * Henter forrige (eldre) behandling relativt til behandlingen som inneholder den oppgitte perioden.
 *
 * Behandlinger er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * @param periode Perioden som identifiserer aktiv behandling.
 * @param inntektsforhold Arbeidsgiver som eier behandlingene.
 * @returns Forrige behandling hvis perioden finnes, nyeste hvis ikke, ellers `null`.
 */
export const finnForrigeEllerNyesteBehandling = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
): Behandling | null => finnNteEllerNyesteBehandling(periode, inntektsforhold, 1);
/**
 * Henter en behandling relativt til behandlingen som inneholder den oppgitte perioden.
 *
 * Behandlinger er lagret i omvendt kronologisk rekkefølge (indeks 0 = nyeste).
 *
 * Regler:
 * 1. Finn behandlingen som inneholder perioden (matcher `id` i beregnet eller uberegnet perioder).
 * 2. Hvis ingen behandling inneholder perioden: returnerer alltid nyeste behandling (indeks 0), eller `null` hvis ingen finnes (parameter \`n\` ignoreres i dette tilfellet).
 * 3. Hvis behandling finnes: returner behandlingen med offset \`n\` (aktiv = 0, eldre = 1, nyere = -1 osv.). Faller utenfor indeks -> `null`.
 *
 * @internal
 * @param periode Perioden som identifiserer aktiv behandling.
 * @param inntektsforhold Arbeidsgiver som eier behandlingene.
 * @param n Offset: 0 = aktiv, 1 = forrige (eldre), -1 = neste (nyere), >1 flere steg tilbake, <-1 flere steg frem.
 * @returns Behandlingen bestemt av offset, nyeste hvis aktiv ikke finnes, eller `null`.
 */
export const finnNteEllerNyesteBehandling = (
    periode: ActivePeriod,
    inntektsforhold: Inntektsforhold,
    n: number = 0,
): Behandling | null => {
    const aktivBehandlingIndex = inntektsforhold.behandlinger.findIndex((g) =>
        g.perioder.some((p) => isBeregnetPeriode(periode) && p.id === periode.id),
    );
    return (
        (aktivBehandlingIndex < 0
            ? inntektsforhold.behandlinger[0]
            : inntektsforhold.behandlinger[aktivBehandlingIndex + n]) ?? null
    );
};

export type InntektsforholdReferanse = ArbeidsgiverReferanse | SelvstendigNæringReferanse;

export const lagArbeidsgiverReferanse = (organisasjonsnummer: string, navn?: string): ArbeidsgiverReferanse => ({
    type: 'Arbeidsgiver',
    organisasjonsnummer: organisasjonsnummer,
    navn: navn,
});

export const arbeidsgiverTilReferanse = (arbeidsgiver: Arbeidsgiver): ArbeidsgiverReferanse =>
    lagArbeidsgiverReferanse(arbeidsgiver.organisasjonsnummer, arbeidsgiver.navn);

export const tilReferanse = (inntektsforhold: Inntektsforhold): InntektsforholdReferanse =>
    isSelvstendigNaering(inntektsforhold) ? { type: 'Selvstendig Næring' } : arbeidsgiverTilReferanse(inntektsforhold);

export const inntektsforholdReferanseTilKey = (referanse: InntektsforholdReferanse): string =>
    referanse.type === 'Arbeidsgiver' ? referanse.organisasjonsnummer : referanse.type;
