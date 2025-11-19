import { useParams, usePathname, useRouter } from 'next/navigation';

export interface Navigation {
    navigateTo: (fane: Fane, aktørId?: string) => void;
    navigateToNext: () => void;
    navigateToPrevious: () => void;
}

export enum Fane {
    Utbetaling,
    Inngangsvilkår,
    Sykepengegrunnlag,
    Vurderingsmomenter,
}

const locations = ['/dagoversikt', '/inngangsvilkår', '/sykepengegrunnlag', '/vurderingsmomenter'];

const locationFromCurrentPath = (path: string, locations: string[]): number => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

const useCurrentPersonPseudoId = (): string | null => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    return personPseudoId ?? null;
};

export const useNavigation = (): Navigation => {
    const pathname = usePathname();
    const router = useRouter();
    const currentPersonPseudoId = useCurrentPersonPseudoId();

    const currentLocation = locationFromCurrentPath(decodeURIComponent(pathname), locations);

    const canNavigateToNext = currentLocation !== locations.length - 1;

    const canNavigateToPrevious = currentLocation !== 0;

    const navigateTo = (ønsketFane: Fane, personPseudoId: string | null = currentPersonPseudoId) => {
        const destination = `/person/${personPseudoId}${locations[ønsketFane]}`;
        if (destination !== pathname) {
            router.push(destination);
        }
    };

    return {
        navigateTo: navigateTo,
        navigateToNext: () => canNavigateToNext && navigateTo(currentLocation + 1),
        navigateToPrevious: () => canNavigateToPrevious && navigateTo(currentLocation - 1),
    };
};
