import { useEffect } from 'react';

import { Location, useNavigation } from '@hooks/useNavigation';

export const useNavigateOnMount = (location: Location) => {
    const { navigateTo } = useNavigation();

    useEffect(() => {
        navigateTo(location);
    }, []);
};
