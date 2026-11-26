'use client';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import {
    ApiBeregnetPeriode,
    ApiPeriodetilstand,
    ApiSaksbildePerson,
    ApiUberegnetPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { erAnnullertPeriode, finnPerioderMedVilkårsgrunnlag } from '@state/sykefraværstilfelle';
import { ankerTilTab, tabTilAnker, useTabgruppe, useVilkårsgrunnlagIdFraUrl } from '@state/tab';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { ActivePeriod } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import {
    PeriodeUrlId,
    erPåPeriodeside,
    erPåSideUtenAktivPeriode,
    lagPeriodeUrl,
    vilkårsgrunnlagIdFraSti,
} from '@utils/undersider';

const activePeriodIdState = atom<string | null>(null);

export const useSetActivePeriodIdUtenPerson = () => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        setActivePeriodId(periodeId);
    };
};

export const useActivePeriod = (person: ApiSaksbildePerson | null): ActivePeriod | null => {
    const activePeriodId = useAtomValue(activePeriodIdState);
    const pathname = usePathname();
    const periodeUrlId = usePeriodeUrlIdFraUrl();
    const vilkårsgrunnlagId = useVilkårsgrunnlagIdISykefraværstilfellet();
    const erUtenAktivPeriode = erPåSideUtenAktivPeriode(pathname);

    if (erUtenAktivPeriode || !person) return null;

    const valgtPeriode = findPeriod(activePeriodId, person);

    if (vilkårsgrunnlagId !== null) {
        if (valgtPeriode && vilkårsgrunnlagIdFor(valgtPeriode) === vilkårsgrunnlagId) return valgtPeriode;
        return finnPeriodeÅVelgeISykefraværstilfellet(person, vilkårsgrunnlagId);
    }

    if (periodeUrlId) {
        // Atomet skiller mellom pølserader som deler samme behandling, URL-en gjør det ikke
        if (valgtPeriode && erSammePeriodeUrlId(periodeUrlIdFor(valgtPeriode), periodeUrlId)) return valgtPeriode;
        return finnPeriodeForUrlId(periodeUrlId, person);
    }

    return valgtPeriode ?? findPeriodToSelect(person);
};

/**
 * Holder sist valgte periode i synk når perioden i URL-en endres uten klikk i tidslinjen, f.eks. med tilbakeknappen.
 * På URL-en for sykefraværstilfellet lagres perioden Speil velger, så valget ikke flytter seg når personen hentes på nytt.
 * Synker bare når URL-en endres, så et klikk som har satt ny periode før navigeringen er ferdig ikke overskrives.
 */
export function useSynkroniserValgtPeriodeMedUrl(aktivPeriode: ActivePeriod | null) {
    const setActivePeriodId = useSetAtom(activePeriodIdState);
    const periodeUrlId = usePeriodeUrlIdFraUrl();
    const vilkårsgrunnlagId = useVilkårsgrunnlagIdISykefraværstilfellet();
    const urlNøkkel = periodeUrlId
        ? `${periodeUrlId.periodeId}/${periodeUrlId.behandlingId ?? ''}`
        : vilkårsgrunnlagId && `sykefravaerstilfelle/${vilkårsgrunnlagId}`;
    const synketUrlNøkkel = useRef<string | null>(null);

    useEffect(() => {
        if (!aktivPeriode || urlNøkkel === null || synketUrlNøkkel.current === urlNøkkel) return;
        synketUrlNøkkel.current = urlNøkkel;
        setActivePeriodId(aktivPeriode.id);
    }, [aktivPeriode, urlNøkkel, setActivePeriodId]);
}

export function usePeriodeUrlIdFraUrl(): PeriodeUrlId | null {
    const { vedtaksperiodeId, behandlingId } = useParams<{ vedtaksperiodeId?: string; behandlingId?: string }>();
    if (!vedtaksperiodeId) return null;
    return {
        periodeId: vedtaksperiodeId,
        ...(behandlingId ? { behandlingId } : {}),
    };
}

/**
 * Vilkårsgrunnlaget i URL-en, bare med det nye saksbildeoppsettet.
 */
function useVilkårsgrunnlagIdISykefraværstilfellet(): string | null {
    const vilkårsgrunnlagId = useVilkårsgrunnlagIdFraUrl();
    const tabgruppe = useTabgruppe();
    return tabgruppe === 'sykefraværstilfelle' ? vilkårsgrunnlagId : null;
}

export function vilkårsgrunnlagIdFor(periode: ActivePeriod): string | null {
    if (isBeregnetPeriode(periode) || isGhostPeriode(periode)) return periode.vilkarsgrunnlagId ?? null;
    return null;
}

/**
 * Ghostperioder har ingen vedtaksperiodeId eller behandlingId, så de identifiseres med sin egen id i URL-en.
 */
export function periodeUrlIdFor(periode: ActivePeriod): PeriodeUrlId {
    return isGhostPeriode(periode)
        ? { periodeId: periode.id }
        : { periodeId: periode.vedtaksperiodeId, behandlingId: periode.behandlingId };
}

export function erSammePeriodeUrlId(a: PeriodeUrlId, b: PeriodeUrlId): boolean {
    return a.periodeId === b.periodeId && a.behandlingId === b.behandlingId;
}

export const useActivePeriodWithPerson = (person: ApiSaksbildePerson): ActivePeriod | null => useActivePeriod(person);

// siste periode brukeren har klikket på i tidslinjen
export const useSistValgtePeriode = (person: ApiSaksbildePerson | null): ActivePeriod | null =>
    findPeriod(useAtomValue(activePeriodIdState), person);

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetAtom(activePeriodIdState);
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();

    return (person: ApiSaksbildePerson) => {
        // Kalles etter en asynkron refetch, så sti og fane leses fra nettleseren i tilfelle brukeren har navigert i mellomtiden
        const { pathname, hash } = window.location;
        const vilkårsgrunnlagId = nyttSaksbildeoppsett ? vilkårsgrunnlagIdFraSti(pathname) : null;
        const periodToSelect = vilkårsgrunnlagId
            ? finnPeriodeÅVelgeISykefraværstilfellet(person, vilkårsgrunnlagId)
            : findPeriodToSelect(person);
        if (!periodToSelect) return;
        setActivePeriodId(periodToSelect.id);

        if (!personPseudoId || !erPåPeriodeside(pathname) || !`${pathname}/`.startsWith(`/person/${personPseudoId}/`))
            return;
        const tab = ankerTilTab(hash);
        router.replace(
            lagPeriodeUrl(personPseudoId, periodeUrlIdFor(periodToSelect), tab ? tabTilAnker(tab) : undefined),
            { scroll: false },
        );
    };
};

export function findPeriod(periodeId: string | null, person: ApiSaksbildePerson | null): ActivePeriod | null {
    if (periodeId == null || person == null) return null;
    return alleValgbarePerioder(person).find((periode) => periode.id === periodeId) ?? null;
}

/**
 * Uten behandlingId, eller med en behandlingId som ikke finnes på vedtaksperioden, velges nyeste behandling.
 */
function finnPeriodeForUrlId(
    { periodeId, behandlingId }: PeriodeUrlId,
    person: ApiSaksbildePerson,
): ActivePeriod | null {
    const perioder = alleValgbarePerioder(person).filter((periode) => periodeUrlIdFor(periode).periodeId === periodeId);
    return perioder.find((periode) => periodeUrlIdFor(periode).behandlingId === behandlingId) ?? perioder[0] ?? null;
}

const findPeriodToSelect = (person: ApiSaksbildePerson): ActivePeriod | null =>
    velgEtterPrioritet(
        finnAlleInntektsforhold(person)
            .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder ?? [])
            .filter((periode) => isUberegnetPeriode(periode) || isBeregnetPeriode(periode)),
    );

/**
 * Annullerte perioder velges bare når alle er annullert, og ghost-perioder bare når sykefraværstilfellet ikke har andre perioder.
 */
function finnPeriodeÅVelgeISykefraværstilfellet(
    person: ApiSaksbildePerson,
    vilkårsgrunnlagId: string,
): ActivePeriod | null {
    const perioder = finnPerioderMedVilkårsgrunnlag(person, vilkårsgrunnlagId);
    const vedtaksperioder = perioder.filter((periode) => isUberegnetPeriode(periode) || isBeregnetPeriode(periode));
    const ikkeAnnullerte = vedtaksperioder.filter((periode) => !erAnnullertPeriode(periode));
    return velgEtterPrioritet(ikkeAnnullerte) ?? velgEtterPrioritet(vedtaksperioder) ?? perioder[0] ?? null;
}

// Først en periode til behandling, så en periode som venter, ellers den nyeste
function velgEtterPrioritet(perioder: (ApiBeregnetPeriode | ApiUberegnetPeriode)[]): ActivePeriod | null {
    const aktuellePerioder = perioder
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetPeriode(period)) &&
                period.periodetilstand !== ApiPeriodetilstand.TilInfotrygd,
        );

    const venteperioder = perioder
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
        .filter((period) => venterTilstander.includes(period.periodetilstand));

    const periodeTilBehandling = aktuellePerioder.find((periode) =>
        tilBehandlingTilstander.includes(periode.periodetilstand),
    );

    return periodeTilBehandling ?? venteperioder[0] ?? aktuellePerioder[0] ?? null;
}

// Behandlingene er sortert med nyeste først, så første treff på vedtaksperiodeId eller behandlingId er nyeste pølserad
function alleValgbarePerioder(person: ApiSaksbildePerson): ActivePeriod[] {
    return finnAlleInntektsforhold(person).flatMap((arbeidsgiver) => {
        const perioder = arbeidsgiver.behandlinger
            .flatMap((behandling) => behandling.perioder)
            .filter((periode) => isUberegnetPeriode(periode) || isBeregnetPeriode(periode));
        const ghostPerioder = (isArbeidsgiver(arbeidsgiver) ? arbeidsgiver.ghostPerioder : []).filter(isGhostPeriode);
        return [...perioder, ...ghostPerioder];
    });
}

const tilBehandlingTilstander: ApiPeriodetilstand[] = [
    ApiPeriodetilstand.TilGodkjenning,
    ApiPeriodetilstand.TilUtbetaling,
];
const venterTilstander: ApiPeriodetilstand[] = [
    ApiPeriodetilstand.VenterPaEnAnnenPeriode,
    ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode,
    ApiPeriodetilstand.AvventerInntektsopplysninger,
    ApiPeriodetilstand.ForberederGodkjenning,
    ApiPeriodetilstand.AvventerAnnullering,
];
