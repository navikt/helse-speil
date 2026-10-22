import React from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useSpleisOpptjeningsvurderingerQuery } from '@io/rest/spleis';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';

interface OpptjeningsvurderingerProps {
    fødselsnummer: string;
}

export function Opptjeningsvurderinger({ fødselsnummer }: OpptjeningsvurderingerProps) {
    const { data, isPending, error } = useSpleisOpptjeningsvurderingerQuery(fødselsnummer);

    if (isPending) return <Loader size="medium" title="Henter opptjeningsvurderinger fra Spleis" />;
    if (error) return <BodyShort>Kunne ikke hente opptjeningsvurderinger fra Spleis: {error.message}</BodyShort>;
    return <JsonVisning data={data} />;
}
