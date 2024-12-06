import { useApolloClient } from '@apollo/client';

export const useRefetchDriftsmeldinger = () => {
    const apolloClient = useApolloClient();
    apolloClient.refetchQueries({
        include: ['Driftsmelding'],
    });
};
