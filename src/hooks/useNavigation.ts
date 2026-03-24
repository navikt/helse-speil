import { SaksbildeTab, saksbildeTabs, useSaksbildeTab } from '@state/tab';

export interface Navigation {
    navigateTo: (tab: SaksbildeTab) => void;
    navigateToNext: () => void;
    navigateToPrevious: () => void;
}

export const useNavigation = (): Navigation => {
    const [currentTab, setTab] = useSaksbildeTab();

    const currentIndex = saksbildeTabs.indexOf(currentTab);
    const canNavigateToNext = currentIndex < saksbildeTabs.length - 1;
    const canNavigateToPrevious = currentIndex > 0;

    return {
        navigateTo: setTab,
        navigateToNext: () => canNavigateToNext && setTab(saksbildeTabs[currentIndex + 1]!),
        navigateToPrevious: () => canNavigateToPrevious && setTab(saksbildeTabs[currentIndex - 1]!),
    };
};
