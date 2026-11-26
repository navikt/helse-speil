import {
    SaksbildeTab,
    tabgruppeForTab,
    saksbildeTabs,
    saksbildeTabsITabgruppene,
    useSaksbildeTab,
    useTabgruppe,
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
    const tabgruppe = useTabgruppe();

    const tabs = nyttSaksbildeoppsett
        ? saksbildeTabsITabgruppene.filter((tab) => tabgruppeForTab(tab) === tabgruppe)
        : saksbildeTabs;
    const currentIndex = tabs.indexOf(currentTab);
    const canNavigateToNext = currentIndex < tabs.length - 1;
    const canNavigateToPrevious = currentIndex > 0;

    return {
        navigateTo: setTab,
        navigateToNext: () => canNavigateToNext && setTab(tabs[currentIndex + 1]!),
        navigateToPrevious: () => canNavigateToPrevious && setTab(tabs[currentIndex - 1]!),
    };
};
