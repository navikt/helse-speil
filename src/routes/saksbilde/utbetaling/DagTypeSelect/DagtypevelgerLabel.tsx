import React, { ReactElement } from 'react';

import { BodyShort, HStack, HelpText, VStack } from '@navikt/ds-react';

export function DagtypevelgerLabel({ erSelvstendig }: { erSelvstendig: boolean }): ReactElement {
    return (
        <HStack as="span" align="center" gap="space-4">
            Dagtype
            {!erSelvstendig && (
                <HelpText title="Forklaring av dagtyper">
                    <VStack gap="space-16">
                        <VStack>
                            <BodyShort weight="semibold">Syk (Nav)</BodyShort>
                            <BodyShort>Nav skal betale alle eller noen av de første 16 dagene</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Ferie</BodyShort>
                            <BodyShort>Bruker tok ferie i sykmeldingsperioden</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Arbeid ikke gjenopptatt</BodyShort>
                            <BodyShort>
                                Bruker tok ferie uten sykmelding
                                <br />
                                Bruker tok turnusfri
                                <br />
                                Brukers stillingsandel ikke fullt gjenopptatt
                            </BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Egenmelding</BodyShort>
                            <BodyShort>Bruker hadde egenmeldt sykefravær</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Permisjon</BodyShort>
                            <BodyShort>Bruker hadde permisjon</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Arbeid</BodyShort>
                            <BodyShort>Bruker var i arbeid</BodyShort>
                        </VStack>
                    </VStack>
                </HelpText>
            )}
        </HStack>
    );
}
