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
        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px', background: '#f5f5f5', padding: '8px' }}>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
