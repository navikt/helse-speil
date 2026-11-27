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

export type Tabgruppe = 'periode' | 'sykefraværstilfelle';

const sykefraværstilfelleTabs: SaksbildeTab[] = [
    'sykepengegrunnlag',
    'inngangsvilkår',
] satisfies SykefraværstilfelleTab[];

const standardTab: Record<Tabgruppe, SaksbildeTab> = {
    periode: 'dagoversikt',
    sykefraværstilfelle: 'sykepengegrunnlag',
};

export function tabgruppeForTab(tab: SaksbildeTab): Tabgruppe {
    return sykefraværstilfelleTabs.includes(tab) ? 'sykefraværstilfelle' : 'periode';
}

export function useTabgruppe(): Tabgruppe {
    const erPåSykefraværstilfellet = useSykefraværstilfelleFraUrl() !== null;
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    return nyttSaksbildeoppsett && erPåSykefraværstilfellet ? 'sykefraværstilfelle' : 'periode';
}

export function useSykefraværstilfelleFraUrl(): string | null {
    const { skjaeringstidspunkt } = useParams<{ skjaeringstidspunkt?: string }>();
    return skjaeringstidspunkt ?? null;
}

/**
 * Saksbildet med tabs, enten for en periode eller for et sykefraværstilfelle.
 */
function useErPåSaksbildeside(): boolean {
    const pathname = usePathname();
    const erPåSykefraværstilfellet = useSykefraværstilfelleFraUrl() !== null;
    return erPåPeriodeside(pathname) || erPåSykefraværstilfellet;
}

export const saksbildeTabs: SaksbildeTab[] = [
    'dagoversikt',
    'inngangsvilkår',
    'sykepengegrunnlag',
    'vurderingsmomenter',
];

// Samme rekkefølge som tabene vises i med det nye saksbildeoppsettet
export const saksbildeTabsITabgruppene: SaksbildeTab[] = [
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

type LagretSaksbildeTab = {
    personPseudoId?: string;
    tab: SaksbildeTab;
    tabPerTabgruppe?: Partial<Record<Tabgruppe, SaksbildeTab>>;
};

const saksbildeTabAtom = atomWithSessionStorage<LagretSaksbildeTab>('saksbildeTabPerPerson', { tab: 'dagoversikt' });

export const useSaksbildeTab = (): [SaksbildeTab, (tab: SaksbildeTab, valg?: SettTabValg) => void] => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const lagret = useAtomValue(saksbildeTabAtom);
    const setTab = useSetSaksbildeTab();
    const tabFraAnker = useTabFraAnker();
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    const tabgruppe = useTabgruppe();

    const lagretForPersonen = lagret.personPseudoId === personPseudoId ? lagret : null;
    const lagretTab = lagretForPersonen?.tab ?? 'dagoversikt';
    const lagretTabITabgruppen = nyttSaksbildeoppsett ? lagretTabForTabgruppe(lagretForPersonen, tabgruppe) : lagretTab;
    const tab = tabFraAnker ?? lagretTabITabgruppen;

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
        setLagret(medLagretTab(lagret, personPseudoId, tabFraAnker));
    }, [tabFraAnker, lagret, personPseudoId, setLagret]);
}

type SettTabValg = { erstatt?: boolean };

export const useSetSaksbildeTab = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const erPåSaksbildeside = useErPåSaksbildeside();
    const setLagret = useSetAtom(saksbildeTabAtom);

    return (tab: SaksbildeTab, { erstatt = false }: SettTabValg = {}) => {
        setLagret((lagret) => medLagretTab(lagret, personPseudoId, tab));
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

function lagretTabForTabgruppe(lagret: LagretSaksbildeTab | null, tabgruppe: Tabgruppe): SaksbildeTab {
    return (lagret && lagretTabPerTabgruppe(lagret))?.[tabgruppe] ?? standardTab[tabgruppe];
}

function medLagretTab(
    lagret: LagretSaksbildeTab,
    personPseudoId: string | undefined,
    tab: SaksbildeTab,
): LagretSaksbildeTab {
    const forrige = lagret.personPseudoId === personPseudoId ? lagretTabPerTabgruppe(lagret) : undefined;
    return { personPseudoId, tab, tabPerTabgruppe: { ...forrige, [tabgruppeForTab(tab)]: tab } };
}

// Verdier lagret før Speil husket taben per tabgruppe har bare én tab
function lagretTabPerTabgruppe(lagret: LagretSaksbildeTab): Partial<Record<Tabgruppe, SaksbildeTab>> {
    return lagret.tabPerTabgruppe ?? { [tabgruppeForTab(lagret.tab)]: lagret.tab };
}

function safeDecode(verdi: string): string {
    try {
        return decodeURIComponent(verdi);
    } catch {
        return verdi;
    }
}
