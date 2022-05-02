import { Location, useNavigation } from '@hooks/useNavigation';
import { useEffect } from 'react';

export const useNavigateOnMount = (location: Location, aktørId: string) => {
    const { navigateTo } = useNavigation();

    useEffect(() => {
        navigateTo(location);
    }, []);
};
