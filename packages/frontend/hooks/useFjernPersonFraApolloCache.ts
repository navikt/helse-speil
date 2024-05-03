import { useEffect } from 'react';

import { useApolloClient } from '@apollo/client';
import { useCurrentPerson } from '@state/person';

export const useFjernPersonFraApolloCache = () => {
    const fodselsnummer = useCurrentPerson()?.fodselsnummer;
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
