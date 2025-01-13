import { useEffect } from 'react';

import { useApolloClient } from '@apollo/client';

export const useRefetchDriftsmeldinger = () => {
    const apolloClient = useApolloClient();

    useEffect(() => {
        const handleRouteChange = () => {
            apolloClient.refetchQueries({
                include: ['Driftsmelding'],
            });
        };

        handleRouteChange();
    }, [apolloClient]);
};
