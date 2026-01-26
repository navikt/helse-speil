import Link from 'next/link';
import React, { ReactElement } from 'react';

import { Alert, HStack } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { getFormattedFødselsnummer } from '@saksbilde/personHeader/Fødselsnummer';
import { useFetchPersonQuery } from '@state/person';

export function VarselOmFlerFødselsnumre(): ReactElement | null {
    const { data } = useFetchPersonQuery();
    const andreFødselsnumre = data?.person?.andreFodselsnummer ?? [];

    if (andreFødselsnumre.length === 0) {
        return null;
    }
    return (
        <Alert variant="warning" size="small" style={{ gridArea: 'unntatt', borderRadius: 0 }}>
            <HStack gap="space-8">
                Personen har også andre fødselsnumre:
                {andreFødselsnumre.map((value, index) => (
                    <HStack key={index}>
                        <Link key={value.fodselsnummer} href={`/person/${value.personPseudoId}/dagoversikt`}>
                            <AnonymizableText>{getFormattedFødselsnummer(value.fodselsnummer)}</AnonymizableText>
                        </Link>
                    </HStack>
                ))}
                Fordi fødselsnumrene er behandlet hver for seg, må du sjekke om systemet har beregnet en periode feil.
            </HStack>
        </Alert>
    );
}
