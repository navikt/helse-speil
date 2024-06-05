import { useParams, usePathname, useRouter } from 'next/navigation';

export interface Navigation {
    aktørId: string | undefined;
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

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

const useCurrentAktørId = (): string | null => {
    const { aktorId } = useParams<{ aktorId: string }>();
    return aktorId ?? null;
};

export const useNavigation = (): Navigation => {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams<{ aktorId: string }>();
    const currentAktørId = useCurrentAktørId();

    const currentLocation = locationFromCurrentPath(decodeURIComponent(pathname), locations);

    const canNavigateToNext = currentLocation !== locations.length - 1;

    const canNavigateToPrevious = currentLocation !== 0;

    const navigateTo = (ønsketFane: Fane, aktørId: string | null = currentAktørId) => {
        const destination = `/person/${aktørId}${locations[ønsketFane]}`;
        const current = pathname;
        if (destination !== current) {
            router.push(destination);
        }
    };

    return {
        aktørId: params.aktorId,
        navigateTo: navigateTo,
        navigateToNext: () => canNavigateToNext && navigateTo(currentLocation + 1),
        navigateToPrevious: () => canNavigateToPrevious && navigateTo(currentLocation - 1),
    };
};
