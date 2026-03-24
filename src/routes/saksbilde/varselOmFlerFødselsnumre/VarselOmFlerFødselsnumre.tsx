import NextLink from 'next/link';
import React, { ReactElement } from 'react';

import { Alert, BodyShort, HStack, Link } from '@navikt/ds-react';

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
        <Alert variant="warning" size="small" style={{ borderRadius: 0 }}>
            <HStack gap="space-8">
                <BodyShort>Personen har også andre fødselsnumre:</BodyShort>
                {andreFødselsnumre.map((value, index) => (
                    <HStack key={index}>
                        <Link as={NextLink} key={value.fodselsnummer} href={`/person/${value.personPseudoId}`}>
                            <AnonymizableText>{getFormattedFødselsnummer(value.fodselsnummer)}</AnonymizableText>
                        </Link>
                    </HStack>
                ))}
                <BodyShort>
                    Fordi fødselsnumrene er behandlet hver for seg, må du sjekke om systemet har beregnet en periode
                    feil.
                </BodyShort>
            </HStack>
        </Alert>
    );
}
