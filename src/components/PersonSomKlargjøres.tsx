'use client';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { usePersonKlargjøres } from '@state/personSomKlargjøres';

export const PersonSomKlargjøres = (): ReactElement | null => {
    const { venter, klargjortPseudoId, nullstill } = usePersonKlargjøres();

    if (venter) {
        return <PersonKlargjøresAlert nullstill={nullstill} />;
    } else if (klargjortPseudoId != null) {
        return <PersonKlargjortAlert personPseudoId={klargjortPseudoId} nullstill={nullstill} />;
    } else {
        return null;
    }
};

function PersonKlargjøresAlert({ nullstill }: { nullstill: () => void }): ReactElement {
    return (
        <Alert variant="info" size="small" onClose={nullstill} closeButton={true}>
            Personen klargjøres, den vil normalt være klar til visning om kort tid.
        </Alert>
    );
}

function PersonKlargjortAlert({
    personPseudoId,
    nullstill,
}: {
    personPseudoId: string;
    nullstill: () => void;
}): ReactElement {
    return (
        <Alert variant="info" size="small" onClose={nullstill} closeButton={true}>
            Personen er klar til visning.{' '}
            <Link href={`/person/${personPseudoId}/dagoversikt`} onClick={nullstill}>
                Klikk her for å navigere til saksbildet.
            </Link>
        </Alert>
    );
}
