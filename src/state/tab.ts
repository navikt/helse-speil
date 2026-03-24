import { useAtom, useSetAtom } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';

export type SaksbildeTab = 'dagoversikt' | 'inngangsvilkår' | 'sykepengegrunnlag' | 'vurderingsmomenter';

export const saksbildeTabs: SaksbildeTab[] = [
    'dagoversikt',
    'inngangsvilkår',
    'sykepengegrunnlag',
    'vurderingsmomenter',
];

const saksbildeTabAtom = atomWithSessionStorage<SaksbildeTab>('saksbildeTab', 'dagoversikt');

export const useSaksbildeTab = () => useAtom(saksbildeTabAtom);

export const useSetSaksbildeTab = () => useSetAtom(saksbildeTabAtom);
