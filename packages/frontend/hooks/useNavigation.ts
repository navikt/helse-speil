import { useHistory } from 'react-router-dom';

import { usePersonLoadable } from '@state/person';
import { isPerson } from '@utils/typeguards';

export interface Navigation {
    toString: (location: Location) => string;
    navigateTo: (location: Location, aktørId?: string) => void;
    pathForLocation: (location: Location, aktørId?: string) => string;
    navigateToNext: () => void;
    navigateToPrevious: () => void;
}

export enum Location {
    Utbetaling,
    Inngangsvilkår,
    Sykepengegrunnlag,
    Faresignaler,
}

const locations = ['/utbetaling', '/inngangsvilkår', '/sykepengegrunnlag', '/faresignaler'];

const locationFromCurrentPath = (path: string, locations: string[]) => {
    const currentPathName = path.split('/')[3];
    return locations.findIndex((location) => location.slice(1) === currentPathName);
};

const useCurrentAktørId = (): string | null => {
    const person = usePersonLoadable();

    return person.state === 'hasValue' && isPerson(person.contents) ? person.contents.aktorId : null;
};

export const useNavigation = (): Navigation => {
    const history = useHistory();
    const currentAktørId = useCurrentAktørId();

    const currentLocation = locationFromCurrentPath(decodeURIComponent(history.location.pathname), locations);

    const canNavigateToNext = currentLocation !== locations.length - 1;

    const canNavigateToPrevious = currentLocation !== 0;

    const navigateTo = (location: Location, aktørId: string | null = currentAktørId) => {
        const destination = `/person/${aktørId}${locations[location]}`;
        const current = history.location.pathname;
        if (destination !== current) {
            history.push(destination);
        }
    };

    const pathForLocation = (location: Location, aktørId?: string) =>
        `/person/${aktørId ?? currentAktørId}${locations[location]}`;

    const toString = (location: Location) => locations[location];

    return {
        toString: toString,
        navigateTo: navigateTo,
        pathForLocation: pathForLocation,
        navigateToNext: () => canNavigateToNext && navigateTo(currentLocation + 1),
        navigateToPrevious: () => canNavigateToPrevious && navigateTo(currentLocation - 1),
    };
};
