import React from 'react';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { useQuery } from '@apollo/client';
import { HentSaksbehandlereDocument } from '@io/graphql';

import styles from './SøkefeltSaksbehandlere.module.css';

export const SøkefeltSaksbehandlere = () => {
    const saksbehandlere = useQuery(HentSaksbehandlereDocument, {
        nextFetchPolicy: 'cache-first',
    });

    const saksbehandlereOptions =
        saksbehandlere.data?.hentSaksbehandlere.map(
            (saksbehandler) => `${saksbehandler.navn} - ${saksbehandler.ident}`,
        ) ?? [];

    return (
        <UNSAFE_Combobox
            options={saksbehandlereOptions}
            label="Saksbehandler"
            size="small"
            className={styles.sokefeltSaksbehandlere}
        />
    );
};
