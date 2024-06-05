import { useEffect } from 'react';

import { Fane, useNavigation } from '@hooks/useNavigation';

export const useNavigateOnMount = (fane: Fane) => {
    const { navigateTo } = useNavigation();

    useEffect(() => {
        navigateTo(fane);
    }, []);
};
