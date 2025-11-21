'use client';

import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { usePersonKlargjøres } from '@state/personSomKlargjøres';

export const PersonSomKlargjøres = (): ReactElement | null => {
    const { venter, klargjortAktørId, nullstill } = usePersonKlargjøres();

    if (venter) {
        return <PersonKlargjøresAlert nullstill={nullstill} />;
    } else if (klargjortAktørId != null) {
        return <PersonKlargjortAlert aktørId={klargjortAktørId} nullstill={nullstill} />;
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

function PersonKlargjortAlert({ aktørId, nullstill }: { aktørId: string; nullstill: () => void }): ReactElement {
    const { data, loading } = useQuery(FetchPersonDocument, {
        fetchPolicy: 'cache-first',
        variables: {
            aktorId: aktørId,
        },
    });

    if (loading) {
        return <PersonKlargjøresAlert nullstill={nullstill} />;
    }

    return (
        <Alert variant="info" size="small" onClose={nullstill} closeButton={true}>
            Personen er klar til visning.{' '}
            <Link href={`/person/${data?.person?.personPseudoId}/dagoversikt`} onClick={nullstill}>
                Klikk her for å navigere til saksbildet.
            </Link>
        </Alert>
    );
}
