import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { atomWithSessionStorage } from '@state/jotai';
import { erPåPeriodeside } from '@utils/undersider';

export type SaksbildeTab = 'dagoversikt' | 'inngangsvilkår' | 'sykepengegrunnlag' | 'utvikler' | 'vurderingsmomenter';

export const saksbildeTabs: SaksbildeTab[] = [
    'dagoversikt',
    'inngangsvilkår',
    'sykepengegrunnlag',
    'vurderingsmomenter',
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

    const lagretTab = lagret.personPseudoId === personPseudoId ? lagret.tab : 'dagoversikt';
    const tab = tabFraAnker ?? lagretTab;

    return [tab, setTab];
};

export function useTabFraAnker(): SaksbildeTab | null {
    const pathname = usePathname();
    const nettleserUrl = useSyncExternalStore(abonnerPåHash, hentPathOgHash, () => '');
    const [nettleserPath = '', hash = ''] = nettleserUrl.split('#');

    // Ankeret kan henge igjen fra forrige side mens Next bytter rute
    if (!erPåPeriodeside(pathname) || nettleserPath !== pathname) return null;
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
    const pathname = usePathname();
    const setLagret = useSetAtom(saksbildeTabAtom);

    return (tab: SaksbildeTab, { erstatt = false }: SettTabValg = {}) => {
        setLagret({ personPseudoId, tab });
        if (erPåPeriodeside(pathname)) settAnker(tabTilAnker(tab), erstatt);
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
