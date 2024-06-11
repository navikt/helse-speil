import { useEffect } from 'react';

import { useApolloClient } from '@apollo/client';
import { useFetchPersonQuery } from '@person/query';

export const useFjernPersonFraApolloCache = () => {
    const { data } = useFetchPersonQuery();
    const fodselsnummer = data?.person?.fodselsnummer;
    const client = useApolloClient();

    useEffect(() => {
        return fodselsnummer
            ? () => {
                  const id = client.cache.identify({ __typename: 'Person', fodselsnummer: fodselsnummer });
                  if (id) client.cache.evict({ id });
              }
            : undefined;
    }, [fodselsnummer]);
};
