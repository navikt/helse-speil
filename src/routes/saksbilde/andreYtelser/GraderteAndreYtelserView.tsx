import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, HGrid, Heading, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { useGetGraderteAndreYtelserForPerson } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { andreYtelseTypeTilNavn } from '@saksbilde/andreYtelser/andreYtelserLabels';
import { somNorskDato } from '@utils/date';

interface GraderteAndreYtelserViewProps {
    andreYtelserId: string;
}

export const GraderteAndreYtelserView = ({ andreYtelserId }: GraderteAndreYtelserViewProps): ReactElement | null => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: graderteAndreYtelser } = useGetGraderteAndreYtelserForPerson(personPseudoId);

    const ytelse = graderteAndreYtelser?.find((it) => it.andreYtelserId === andreYtelserId);

    if (!ytelse) return null;

    return (
        <Box marginBlock="space-16" width="max-content">
            <Box
                background="neutral-soft"
                paddingBlock="space-16 space-20"
                paddingInline="space-24"
                width="460px"
                borderRadius="4"
            >
                <VStack gap="space-16">
                    <Heading size="small" level="2">
                        {andreYtelseTypeTilNavn[ytelse.andreYtelseType]}
                    </Heading>
                    <HGrid columns={3} gap="space-8">
                        <BodyShort weight="semibold">Periode f.o.m.</BodyShort>
                        <BodyShort weight="semibold">Periode t.o.m.</BodyShort>
                        <BodyShort weight="semibold">Grad</BodyShort>
                        {ytelse.perioder.map((periode) => (
                            <React.Fragment key={periode.fom + periode.tom}>
                                <BodyShort>{somNorskDato(periode.fom)}</BodyShort>
                                <BodyShort>{somNorskDato(periode.tom)}</BodyShort>
                                <BodyShort>{periode.grad} %</BodyShort>
                            </React.Fragment>
                        ))}
                    </HGrid>
                </VStack>
            </Box>
        </Box>
    );
};
