import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';

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
    Faresignaler,
}

const locations = ['/dagoversikt', '/inngangsvilkår', '/sykepengegrunnlag', '/faresignaler'];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

const useCurrentAktørId = (): string | null => {
    const { aktorId } = useParams<{ aktorId: string }>();
    return aktorId ?? null;
};

export const useNavigation = (): Navigation => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentAktørId = useCurrentAktørId();

    const currentLocation = locationFromCurrentPath(decodeURIComponent(location.pathname), locations);

    const canNavigateToNext = currentLocation !== locations.length - 1;

    const canNavigateToPrevious = currentLocation !== 0;

    const navigateTo = (ønsketFane: Fane, aktørId: string | null = currentAktørId) => {
        const destination = `/person/${aktørId}${locations[ønsketFane]}`;
        const current = location.pathname;
        if (destination !== current) {
            navigate(destination);
        }
    };

    return {
        aktørId: useMatch('/person/:aktorId/*')?.params.aktorId,
        navigateTo: navigateTo,
        navigateToNext: () => canNavigateToNext && navigateTo(currentLocation + 1),
        navigateToPrevious: () => canNavigateToPrevious && navigateTo(currentLocation - 1),
    };
};
