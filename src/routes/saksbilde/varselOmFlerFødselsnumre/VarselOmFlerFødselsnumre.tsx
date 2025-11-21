import Link from 'next/link';
import { ReactElement } from 'react';

import { Alert, HStack } from '@navikt/ds-react';

import { useFetchPersonQuery } from '@state/person';

export function VarselOmFlerFødselsnumre(): ReactElement | null {
    const { data } = useFetchPersonQuery();
    const andreFødselsnumre = data?.person?.andreFodselsnummer ?? [];

    if (andreFødselsnumre.length === 0) {
        return null;
    }
    return (
        <Alert variant="warning" size="small" style={{ gridArea: 'unntatt' }}>
            <HStack gap="2">
                Personen har flere fødselsnumre:
                {andreFødselsnumre.map((value) => (
                    <Link key={value.fodselsnummer} href={`/person/${value.personPseudoId}/dagoversikt`}>
                        {value.fodselsnummer}
                    </Link>
                ))}
            </HStack>
        </Alert>
    );
}
