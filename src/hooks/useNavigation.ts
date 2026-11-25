import {
    SaksbildeTab,
    delForTab,
    saksbildeTabs,
    saksbildeTabsIDelene,
    useSaksbildeTab,
    useSaksbildedel,
} from '@state/tab';
import { useNyttSaksbildeoppsett } from '@state/toggles';

export interface Navigation {
    navigateTo: (tab: SaksbildeTab) => void;
    navigateToNext: () => void;
    navigateToPrevious: () => void;
}

export const useNavigation = (): Navigation => {
    const [currentTab, setTab] = useSaksbildeTab();
    const nyttSaksbildeoppsett = useNyttSaksbildeoppsett();
    const del = useSaksbildedel();

    const tabs = nyttSaksbildeoppsett ? saksbildeTabsIDelene.filter((tab) => delForTab(tab) === del) : saksbildeTabs;
    const currentIndex = tabs.indexOf(currentTab);
    const canNavigateToNext = currentIndex < tabs.length - 1;
    const canNavigateToPrevious = currentIndex > 0;

    return {
        navigateTo: setTab,
        navigateToNext: () => canNavigateToNext && setTab(tabs[currentIndex + 1]!),
        navigateToPrevious: () => canNavigateToPrevious && setTab(tabs[currentIndex - 1]!),
    };
};
