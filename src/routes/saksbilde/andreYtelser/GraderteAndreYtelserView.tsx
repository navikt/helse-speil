'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { ArrowUndoIcon, PersonPencilIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, HStack, Heading, Link, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { AndreYtelserFjernetAlert } from '@saksbilde/andreYtelser/AndreYtelserFjernetAlert';
import { EndringsloggAndreYtelserButton } from '@saksbilde/andreYtelser/EndringsloggAndreYtelserButton';
import { FjernAndreYtelserDialog } from '@saksbilde/andreYtelser/FjernAndreYtelserDialog';
import { andreYtelserTypeTilNavn } from '@saksbilde/andreYtelser/andreYtelserLabels';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';
import { IconAndreYtelser } from '@saksbilde/table/icons/IconAndreYtelser';
import { useFetchPersonQuery } from '@state/person';
import { somNorskDato } from '@utils/date';

interface GraderteAndreYtelserViewProps {
    andreYtelserId: string;
}

export const GraderteAndreYtelserView = ({ andreYtelserId }: GraderteAndreYtelserViewProps): ReactElement | null => {
    const router = useRouter();
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const erReadOnly = useHarTotrinnsvurdering(person);
    const { ytelse } = useGraderteAndreYtelser(andreYtelserId);

    const [showFjernModal, setShowFjernModal] = useState(false);

    if (!ytelse) return null;

    const kanEndres = !ytelse.fjernet && !erReadOnly;

    return (
        <>
            <Box
                background="neutral-soft"
                marginBlock="space-0 space-16"
                paddingBlock="space-16 space-20"
                paddingInline="space-32"
                width="fit-content"
                minWidth="460px"
            >
                <VStack gap="space-16" align="start">
                    {kanEndres && (
                        <Button
                            variant="secondary"
                            size="xsmall"
                            icon={<PersonPencilIcon />}
                            onClick={() => router.push(`${andreYtelserId}/endre`)}
                        >
                            Endre
                        </Button>
                    )}
                    <HStack align="center" gap="space-4">
                        <IconAndreYtelser alt="Nav-logo" />
                        <Heading size="xsmall" level="2">
                            {andreYtelserTypeTilNavn[ytelse.andreYtelserType]}
                        </Heading>
                        <EndringsloggAndreYtelserButton ytelse={ytelse} />
                    </HStack>
                    <VStack paddingInline="space-28" gap="space-16">
                        <HGrid columns={3} gap="space-8" width="100%">
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
                        {ytelse.fjernet && <AndreYtelserFjernetAlert events={ytelse.events} />}
                    </VStack>
                    {kanEndres && (
                        <Button
                            variant="tertiary"
                            size="small"
                            icon={<XMarkOctagonIcon />}
                            onClick={() => setShowFjernModal(true)}
                        >
                            Fjern ytelse
                        </Button>
                    )}
                    {ytelse.fjernet && !erReadOnly && (
                        <Link as={NextLink} href={`${andreYtelserId}/gjenopprett`}>
                            <ArrowUndoIcon fontSize="1.3rem" />
                            Legg til ytelsen likevel
                        </Link>
                    )}
                </VStack>
            </Box>
            <FjernAndreYtelserDialog open={showFjernModal} onOpenChange={setShowFjernModal} ytelse={ytelse} />
        </>
    );
};
