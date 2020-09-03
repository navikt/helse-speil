import { useContext } from 'react';
import { useHistory } from 'react-router';
import { PersonContext } from '../context/PersonContext';
import { Periodetype } from '../context/types.internal';
import { routeForMiljø } from '../routes';

export interface Navigation {
    toString: (location: Location) => string;
    navigateTo: (location: Location, aktørId?: string) => void;
    pathForLocation: (location: Location, aktørId?: string) => string;
    navigateToNext?: () => void;
    navigateToPrevious?: () => void;
}

export enum Location {
    Sykmeldingsperiode,
    Vilkår,
    Inntektskilder,
    Sykepengegrunnlag,
    Utbetalingsoversikt,
    Oppsummering,
}

const locations = [
    '/sykmeldingsperiode',
    '/vilkår',
    '/inntektskilder',
    '/sykepengegrunnlag',
    '/utbetalingsoversikt',
    '/oppsummering',
];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[1];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

export const useNavigation = (): Navigation => {
    const history = useHistory();
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    const availableLocations =
        aktivVedtaksperiode?.periodetype === Periodetype.Infotrygdforlengelse
            ? locations.filter((l) => l !== locations[Location.Inntektskilder])
            : locations;

    const currentLocation = locationFromCurrentPath(decodeURIComponent(history.location.pathname), availableLocations);

    const navigateTo = (location: Location, aktørId: string | undefined = personTilBehandling?.aktørId) => {
        history.push(routeForMiljø(`${availableLocations[location]}/${aktørId}`));
    };

    const navigateToNext = () => {
        if (currentLocation === availableLocations.length - 1) return;
        navigateTo(currentLocation + 1);
    };

    const navigateToPrevious = () => {
        if (currentLocation === 0) return;
        navigateTo(currentLocation - 1);
    };

    const pathForLocation = (location: Location, aktørId?: string) =>
        `${locations[location]}/${aktørId ?? personTilBehandling?.aktørId}`;

    const toString = (location: Location) => locations[location];

    const canNavigateToNext = currentLocation !== availableLocations.length - 1;
    const canNavigateToPrevious = currentLocation !== 0;

    return {
        toString,
        navigateTo,
        pathForLocation,
        navigateToNext: canNavigateToNext ? navigateToNext : undefined,
        navigateToPrevious: canNavigateToPrevious ? navigateToPrevious : undefined,
    };
};
