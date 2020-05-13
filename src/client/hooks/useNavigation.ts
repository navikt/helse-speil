import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { PersonContext } from '../context/PersonContext';
import { ForlengelseFraInfotrygd, Person } from '../context/types';

export interface Navigation {
    toString: (location: Location) => string;
    navigateTo: (location: Location, person?: Person) => void;
    pathForLocation: (location: Location) => string;
    navigateToNext?: () => void;
    navigateToPrevious?: () => void;
}

export enum Location {
    Sykmeldingsperiode,
    Vilkår,
    Inntektskilder,
    Sykepengegrunnlag,
    Utbetalingsoversikt,
    Oppsummering
}

const locations = [
    '/sykmeldingsperiode',
    '/vilkår',
    '/inntektskilder',
    '/sykepengegrunnlag',
    '/utbetalingsoversikt',
    '/oppsummering'
];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[1];
    return locations.findIndex(location => location.slice(1) === currentPathName);
};

export const useNavigation = (): Navigation => {
    const history = useHistory();
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const [availableLocations, setAvailableLocations] = useState(locations);
    const currentLocation = locationFromCurrentPath(decodeURIComponent(history.location.pathname), availableLocations);

    useEffect(() => {
        if (aktivVedtaksperiode?.forlengelseFraInfotrygd === ForlengelseFraInfotrygd.JA) {
            setAvailableLocations(locations.filter(l => l !== locations[Location.Inntektskilder]));
        } else {
            setAvailableLocations(locations);
        }
    }, [aktivVedtaksperiode]);

    const navigateTo = (location: Location, person: Person | undefined = personTilBehandling) => {
        history.push(`${availableLocations[location]}/${person?.aktørId}`);
    };

    const navigateToNext = () => {
        if (currentLocation === availableLocations.length - 1) return;
        navigateTo(currentLocation + 1);
    };

    const navigateToPrevious = () => {
        if (currentLocation === 0) return;
        navigateTo(currentLocation - 1);
    };

    const pathForLocation = (location: Location) => `${locations[location]}/${personTilBehandling?.aktørId}`;

    const toString = (location: Location) => locations[location];

    const canNavigateToNext = currentLocation !== availableLocations.length - 1;
    const canNavigateToPrevious = currentLocation !== 0;

    return {
        toString,
        navigateTo,
        pathForLocation,
        navigateToNext: canNavigateToNext ? navigateToNext : undefined,
        navigateToPrevious: canNavigateToPrevious ? navigateToPrevious : undefined
    };
};
