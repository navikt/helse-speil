import { useContext } from 'react';
import { useHistory } from 'react-router';
import { PersonContext } from '../context/PersonContext';
import { routeForMiljø } from '../routes';

export interface Navigation {
    toString: (location: Location) => string;
    navigateTo: (location: Location, aktørId?: string) => void;
    pathForLocation: (location: Location, aktørId?: string) => string;
    navigateToNext?: () => void;
    navigateToPrevious?: () => void;
}

export enum Location {
    Utbetaling,
    Sykmeldingsperiode,
    Vilkår,
    Sykepengegrunnlag,
}

const locations = ['/utbetaling', '/sykmeldingsperiode', '/vilkår', '/sykepengegrunnlag'];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

export const useNavigation = (): Navigation => {
    const history = useHistory();
    const { personTilBehandling } = useContext(PersonContext);

    const currentLocation = locationFromCurrentPath(decodeURIComponent(history.location.pathname), locations);

    const navigateTo = (location: Location, aktørId: string | undefined = personTilBehandling?.aktørId) => {
        history.push(routeForMiljø(`/person/${aktørId}${locations[location]}`));
    };

    const navigateToNext = () => {
        if (currentLocation === locations.length - 1) return;
        navigateTo(currentLocation + 1);
    };

    const navigateToPrevious = () => {
        if (currentLocation === 0) return;
        navigateTo(currentLocation - 1);
    };

    const pathForLocation = (location: Location, aktørId?: string) =>
        `/person/${aktørId ?? personTilBehandling?.aktørId}${locations[location]}`;

    const toString = (location: Location) => locations[location];

    const canNavigateToNext = currentLocation !== locations.length - 1;
    const canNavigateToPrevious = currentLocation !== 0;

    return {
        toString,
        navigateTo,
        pathForLocation,
        navigateToNext: canNavigateToNext ? navigateToNext : undefined,
        navigateToPrevious: canNavigateToPrevious ? navigateToPrevious : undefined,
    };
};
