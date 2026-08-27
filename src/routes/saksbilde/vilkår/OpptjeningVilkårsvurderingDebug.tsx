import React, { ReactElement } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

interface OpptjeningVilkårsvurderingDebugProps {
    personPseudoId: string;
    opptjeningsvurderingId: string;
}

export function OpptjeningVilkårsvurderingDebug({
    personPseudoId,
    opptjeningsvurderingId,
}: OpptjeningVilkårsvurderingDebugProps): ReactElement {
    const { data, isLoading, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId,
    });

    if (isLoading) return <Loader size="small" />;
    if (isError) return <BodyShort>Feil ved henting av vilkårsvurdering</BodyShort>;

    return (
        <pre className="text-ax-text-default max-h-100 overflow-auto bg-ax-bg-neutral-moderate p-2 text-xs">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
