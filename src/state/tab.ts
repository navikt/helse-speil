import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { atomWithSessionStorage } from '@state/jotai';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { erPåPeriodeside } from '@utils/undersider';

export type PeriodeTab = 'dagoversikt' | 'utvikler' | 'vurderingsmomenter';
export type SykefraværstilfelleTab = 'sykepengegrunnlag' | 'inngangsvilkår';
export type SaksbildeTab = PeriodeTab | SykefraværstilfelleTab;

export type Saksbildedel = 'periode' | 'sykefraværstilfelle';

const sykefraværstilfelleTabs: SaksbildeTab[] = [
    'sykepengegrunnlag',
    'inngangsvilkår',
] satisfies SykefraværstilfelleTab[];

const standardTab: Record<Saksbildedel, SaksbildeTab> = {
    periode: 'dagoversikt',
    sykefraværstilfelle: 'sykepengegrunnlag',
};

export function delForTab(tab: SaksbildeTab): Saksbildedel {
    return sykefraværstilfelleTabs.includes(tab) ? 'sykefraværstilfelle' : 'periode';
}

export function useSaksbildedel(): Saksbildedel {
    const erPåSykefraværstilfellet = useVilkårsgrunnlagIdFraUrl() !== null;
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    return nyttSaksbildeoppsett && erPåSykefraværstilfellet ? 'sykefraværstilfelle' : 'periode';
}

export function useVilkårsgrunnlagIdFraUrl(): string | null {
    const { vilkarsgrunnlagId } = useParams<{ vilkarsgrunnlagId?: string }>();
    return vilkarsgrunnlagId ?? null;
}

/**
 * Saksbildet med faner, enten for en periode eller for et sykefraværstilfelle.
 */
function useErPåSaksbildeside(): boolean {
    const pathname = usePathname();
    const erPåSykefraværstilfellet = useVilkårsgrunnlagIdFraUrl() !== null;
    return erPåPeriodeside(pathname) || erPåSykefraværstilfellet;
}

export const saksbildeTabs: SaksbildeTab[] = [
    'dagoversikt',
    'inngangsvilkår',
    'sykepengegrunnlag',
    'vurderingsmomenter',
];

// Samme rekkefølge som fanene vises i med det nye saksbildeoppsettet
export const saksbildeTabsIDelene: SaksbildeTab[] = [
    'dagoversikt',
    'vurderingsmomenter',
    'utvikler',
    'sykepengegrunnlag',
    'inngangsvilkår',
];

// Ankrene holdes til ASCII så URL-en ikke blir prosentkodet når den deles
const tabAnker: Record<SaksbildeTab, string> = {
    dagoversikt: 'dagoversikt',
    inngangsvilkår: 'inngangsvilkar',
    sykepengegrunnlag: 'sykepengegrunnlag',
    utvikler: 'utvikler',
    vurderingsmomenter: 'vurderingsmomenter',
};

export function tabTilAnker(tab: SaksbildeTab): string {
    return tabAnker[tab];
}

export function ankerTilTab(hash: string): SaksbildeTab | null {
    const anker = safeDecode(hash.replace(/^#/, ''));
    const tab = (Object.keys(tabAnker) as SaksbildeTab[]).find((t) => tabAnker[t] === anker || t === anker);
    return tab ?? null;
}

type LagretSaksbildeTab = { personPseudoId?: string; tab: SaksbildeTab };

const saksbildeTabAtom = atomWithSessionStorage<LagretSaksbildeTab>('saksbildeTabPerPerson', { tab: 'dagoversikt' });

export const useSaksbildeTab = (): [SaksbildeTab, (tab: SaksbildeTab, valg?: SettTabValg) => void] => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const lagret = useAtomValue(saksbildeTabAtom);
    const setTab = useSetSaksbildeTab();
    const tabFraAnker = useTabFraAnker();
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    const del = useSaksbildedel();

    const lagretTab = lagret.personPseudoId === personPseudoId ? lagret.tab : 'dagoversikt';
    const lagretTabIDelen = !nyttSaksbildeoppsett || delForTab(lagretTab) === del ? lagretTab : standardTab[del];
    const tab = tabFraAnker ?? lagretTabIDelen;

    return [tab, setTab];
};

export function useTabFraAnker(): SaksbildeTab | null {
    const pathname = usePathname();
    const erPåSaksbildeside = useErPåSaksbildeside();
    const nettleserUrl = useSyncExternalStore(abonnerPåHash, hentPathOgHash, () => '');
    const [nettleserPath = '', hash = ''] = nettleserUrl.split('#');

    // Ankeret kan henge igjen fra forrige side mens Next bytter rute
    if (!erPåSaksbildeside || nettleserPath !== pathname) return null;
    return ankerTilTab(hash);
}

/**
 * Lagrer fanen fra ankeret når det endres uten fanevalg, f.eks. med tilbakeknappen, så den huskes når man forlater perioden.
 */
export function useLagreTabFraAnker() {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const [lagret, setLagret] = useAtom(saksbildeTabAtom);
    const tabFraAnker = useTabFraAnker();

    useEffect(() => {
        if (tabFraAnker === null) return;
        if (lagret.tab === tabFraAnker && lagret.personPseudoId === personPseudoId) return;
        setLagret({ personPseudoId, tab: tabFraAnker });
    }, [tabFraAnker, lagret, personPseudoId, setLagret]);
}

type SettTabValg = { erstatt?: boolean };

export const useSetSaksbildeTab = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const erPåSaksbildeside = useErPåSaksbildeside();
    const setLagret = useSetAtom(saksbildeTabAtom);

    return (tab: SaksbildeTab, { erstatt = false }: SettTabValg = {}) => {
        setLagret({ personPseudoId, tab });
        if (erPåSaksbildeside) settAnker(tabTilAnker(tab), erstatt);
    };
};

export const useNullstillSaksbildeTab = () => {
    const setLagret = useSetAtom(saksbildeTabAtom);

    return () => setLagret(RESET);
};

const ankerEndretEvent = 'saksbilde-anker-endret';

function abonnerPåHash(callback: () => void): () => void {
    window.addEventListener('hashchange', callback);
    window.addEventListener('popstate', callback);
    window.addEventListener(ankerEndretEvent, callback);
    return () => {
        window.removeEventListener('hashchange', callback);
        window.removeEventListener('popstate', callback);
        window.removeEventListener(ankerEndretEvent, callback);
    };
}

function hentPathOgHash(): string {
    return safeDecode(window.location.pathname) + window.location.hash;
}

function settAnker(anker: string, erstatt: boolean) {
    if (window.location.hash === `#${anker}`) return;
    const url = `${window.location.pathname}${window.location.search}#${anker}`;
    if (erstatt) {
        window.history.replaceState(window.history.state, '', url);
    } else {
        window.history.pushState(window.history.state, '', url);
    }
    window.dispatchEvent(new Event(ankerEndretEvent));
}

function safeDecode(verdi: string): string {
    try {
        return decodeURIComponent(verdi);
    } catch {
        return verdi;
    }
}
