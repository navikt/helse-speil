import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useParams } from 'next/navigation';

import { atomWithSessionStorage } from '@state/jotai';

export type SaksbildeTab = 'dagoversikt' | 'inngangsvilkår' | 'sykepengegrunnlag' | 'vurderingsmomenter';

export const saksbildeTabs: SaksbildeTab[] = [
    'dagoversikt',
    'inngangsvilkår',
    'sykepengegrunnlag',
    'vurderingsmomenter',
];

type LagretSaksbildeTab = { personPseudoId?: string; tab: SaksbildeTab };

const saksbildeTabAtom = atomWithSessionStorage<LagretSaksbildeTab>('saksbildeTabPerPerson', { tab: 'dagoversikt' });

export const useSaksbildeTab = (): [SaksbildeTab, (tab: SaksbildeTab) => void] => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const lagret = useAtomValue(saksbildeTabAtom);
    const setTab = useSetSaksbildeTab();

    const tab = lagret.personPseudoId === personPseudoId ? lagret.tab : 'dagoversikt';

    return [tab, setTab];
};

export const useSetSaksbildeTab = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const setLagret = useSetAtom(saksbildeTabAtom);

    return (tab: SaksbildeTab) => setLagret({ personPseudoId, tab });
};

export const useNullstillSaksbildeTab = () => {
    const setLagret = useSetAtom(saksbildeTabAtom);

    return () => setLagret(RESET);
};
