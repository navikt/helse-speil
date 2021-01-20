import { useHistory } from 'react-router';
import { routeForMiljø } from '../routes';
import { usePerson } from '../state/person';
import { viseFaresignalTab } from '../featureToggles';

export interface Navigation {
    toString: (location: Location) => string;
    navigateTo: (location: Location, aktørId?: string) => void;
    pathForLocation: (location: Location, aktørId?: string) => string;
    navigateToNext: () => void;
    navigateToPrevious: () => void;
}

export enum Location {
    Utbetaling,
    Sykmeldingsperiode,
    Vilkår,
    Sykepengegrunnlag,
    Faresignaler,
}

const locations = ['/utbetaling', '/sykmeldingsperiode', '/vilkår', '/sykepengegrunnlag', '/faresignaler'];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

export const useNavigation = (): Navigation => {
    const history = useHistory();
    const personTilBehandling = usePerson();

    const currentLocation = locationFromCurrentPath(decodeURIComponent(history.location.pathname), locations);

    const canNavigateToNext = currentLocation !== locations.length - (viseFaresignalTab ? 1 : 2);

    const canNavigateToPrevious = currentLocation !== 0;

    const navigateTo = (location: Location, aktørId: string | undefined = personTilBehandling?.aktørId) =>
        history.push(routeForMiljø(`/person/${aktørId}${locations[location]}`));

    const pathForLocation = (location: Location, aktørId?: string) =>
        `/person/${aktørId ?? personTilBehandling?.aktørId}${locations[location]}`;

    const toString = (location: Location) => locations[location];

    return {
        toString: toString,
        navigateTo: navigateTo,
        pathForLocation: pathForLocation,
        navigateToNext: () => canNavigateToNext && navigateTo(currentLocation + 1),
        navigateToPrevious: () => canNavigateToPrevious && navigateTo(currentLocation - 1),
    };
};
