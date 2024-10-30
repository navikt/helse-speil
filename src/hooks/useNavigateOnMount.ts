import { useEffect } from 'react';

import { Fane, useNavigation } from '@hooks/useNavigation';

export const useNavigateOnMount = (fane: Fane | undefined) => {
    const { navigateTo } = useNavigation();

    useEffect(() => {
        if (fane != undefined) {
            navigateTo(fane);
        }
    }, [fane]);
};
