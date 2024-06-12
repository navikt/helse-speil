import { useEffect } from 'react';

import { useApolloClient } from '@apollo/client';

export const useFjernPersonFraApolloCache = () => {
    const client = useApolloClient();

    useEffect(() => {
        client.cache.modify({
            fields: {
                person: (_, { DELETE }) => DELETE,
            },
        });

        client.cache.gc();
    }, [client]);
};
