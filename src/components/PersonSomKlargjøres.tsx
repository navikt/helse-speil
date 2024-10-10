'use client';

import Link from 'next/link';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { usePersonKlargjøres } from '@state/personSomKlargjøres';

export const PersonSomKlargjøres = () => {
    const { venter, klargjortAktørId, nullstill } = usePersonKlargjøres();
    return venter ? (
        <Alert variant="info" size="small" onClose={nullstill} closeButton={true}>
            Personen klargjøres, den vil normalt være klar til visning om kort tid.
        </Alert>
    ) : klargjortAktørId != null ? (
        <Alert variant="info" size="small" onClose={nullstill} closeButton={true}>
            Personen er klar til visning.{' '}
            <Link href={`/person/${klargjortAktørId}/dagoversikt`} onClick={nullstill}>
                Klikk her for å navigere til saksbildet.
            </Link>
        </Alert>
    ) : (
        <></>
    );
};
