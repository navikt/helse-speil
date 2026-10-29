import React from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useRettighetskategoriQuery } from '@io/rest/rettighetskategori';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';

interface RettighetskategoriProps {
    personPseudoId: string;
    rettighetskategoriId?: string;
}

export function Rettighetskategori({ personPseudoId, rettighetskategoriId }: RettighetskategoriProps) {
    const { data, isPending, error } = useRettighetskategoriQuery(personPseudoId, rettighetskategoriId);

    return (
        <>
            {!rettighetskategoriId ? (
                <BodyShort>Vedtaksperioden har ikke vilkårsgrunnlag med rettighetskategori</BodyShort>
            ) : isPending ? (
                <Loader size="small" title="Henter rettighetskategori" />
            ) : error ? (
                <BodyShort>Kunne ikke hente rettighetskategori: {error.message}</BodyShort>
            ) : (
                <JsonVisning data={data} />
            )}
        </>
    );
}
