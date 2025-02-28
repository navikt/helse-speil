import { useParams, usePathname, useRouter } from 'next/navigation';

import { Maybe } from '@io/graphql';

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
    TilkommenInntekt,
}

const locations = [
    '/dagoversikt',
    '/inngangsvilkår',
    '/sykepengegrunnlag',
    '/vurderingsmomenter',
    '/tilkommen-inntekt',
];

const locationFromCurrentPath = (path: string, locations: string[]): number => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

const useCurrentAktørId = (): Maybe<string> => {
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

    const navigateTo = (ønsketFane: Fane, aktørId: Maybe<string> = currentAktørId) => {
        const destination = `/person/${aktørId}${locations[ønsketFane]}`;
        if (destination !== pathname) {
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
