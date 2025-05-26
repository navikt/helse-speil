import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { ArrowUndoIcon, PersonPencilIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, HStack, Link, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { Maybe } from '@io/graphql';
import { EndringsloggTilkommenInntektButton } from '@saksbilde/tilkommenInntekt/EndringsloggTilkommenInntektButton';
import { beregnInntektPerDag } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { FjernTilkommenInntektModal } from '@saksbilde/tilkommenInntekt/visning/FjernTilkommenInntektModal';
import { TilkommenInntektArbeidsgivernavn } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektArbeidsgivernavn';
import { TilkommenInntektDagoversikt } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektDagoversikt';
import { TilkommenInntektFjernetAlert } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektFjernetAlert';
import { useFetchPersonQuery } from '@state/person';
import { useTilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

interface TilkommenInntektVisningProps {
    tilkommenInntektId: string;
}

export const TilkommenInntektView = ({ tilkommenInntektId }: TilkommenInntektVisningProps): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const router = useRouter();

    const { organisasjonsnummer, tilkommenInntekt } = useTilkommenInntektMedOrganisasjonsnummer(
        tilkommenInntektId,
        person?.fodselsnummer,
    );

    const [showFjernModal, setShowFjernModal] = useState(false);

    if (!tilkommenInntekt || !organisasjonsnummer || !person) return null;

    const inntektPerDag = beregnInntektPerDag(
        Number(tilkommenInntekt.periodebelop),
        tilkommenInntekt.periode,
        tilkommenInntekt.ekskluderteUkedager,
    );

    return (
        <>
            <Box marginBlock="4" width="max-content">
                <HStack wrap={false}>
                    <VStack>
                        <Box height="2.5rem">
                            <HStack style={{ paddingLeft: '5px' }} paddingBlock="2 4">
                                {!tilkommenInntekt.fjernet && (
                                    <Button
                                        variant="secondary"
                                        size="xsmall"
                                        icon={<PersonPencilIcon />}
                                        onClick={() => router.push(tilkommenInntektId + '/endre')}
                                    >
                                        Endre
                                    </Button>
                                )}
                            </HStack>
                        </Box>
                        <Box
                            background="surface-subtle"
                            borderWidth="0 0 0 3"
                            style={{ borderColor: 'transparent' }}
                            paddingBlock="4 5"
                            paddingInline="6"
                            width="460px"
                        >
                            <VStack gap="4" align="start">
                                <VStack gap="4" paddingInline="2">
                                    <HStack align="center">
                                        <TilkommenInntektArbeidsgivernavn organisasjonsnummer={organisasjonsnummer} />
                                        <EndringsloggTilkommenInntektButton tilkommenInntekt={tilkommenInntekt} />
                                    </HStack>
                                    <VStack paddingInline="7" gap="4">
                                        <HGrid columns={2} gap="2" width="450px">
                                            <VStack>
                                                <BodyShort weight="semibold">Periode f.o.m.</BodyShort>
                                                <BodyShort>{somNorskDato(tilkommenInntekt.periode.fom)}</BodyShort>
                                            </VStack>
                                            <VStack>
                                                <BodyShort weight="semibold">Periode t.o.m.</BodyShort>
                                                <BodyShort>{somNorskDato(tilkommenInntekt.periode.tom)}</BodyShort>
                                            </VStack>
                                            <VStack>
                                                <BodyShort weight="semibold">Inntekt for perioden</BodyShort>
                                                <BodyShort>
                                                    {somPenger(Number(tilkommenInntekt.periodebelop))}
                                                </BodyShort>
                                            </VStack>
                                            <VStack>
                                                <BodyShort weight="semibold">Inntekt per dag</BodyShort>
                                                <BodyShort>
                                                    {Number.isNaN(inntektPerDag) || !Number.isFinite(inntektPerDag)
                                                        ? ''
                                                        : somPenger(inntektPerDag)}
                                                </BodyShort>
                                            </VStack>
                                        </HGrid>
                                        {tilkommenInntekt.fjernet && (
                                            <TilkommenInntektFjernetAlert
                                                tilkommenInntektEvents={tilkommenInntekt.events}
                                            />
                                        )}
                                    </VStack>
                                </VStack>
                                {!tilkommenInntekt.fjernet && (
                                    <Button
                                        variant="tertiary"
                                        size="small"
                                        icon={<XMarkOctagonIcon />}
                                        onClick={() => setShowFjernModal(true)}
                                    >
                                        Fjern periode
                                    </Button>
                                )}
                                {tilkommenInntekt.fjernet && (
                                    <Box paddingInline="4">
                                        <Link as={NextLink} href={`${tilkommenInntektId}/gjenopprett`}>
                                            <ArrowUndoIcon fontSize="1.3rem" />
                                            Legg til perioden likevel
                                        </Link>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                    <VStack>
                        <Box height="2.5rem" />
                        <TilkommenInntektDagoversikt
                            arbeidsgivere={person.arbeidsgivere}
                            periode={tilkommenInntekt.periode}
                            ekskluderteUkedager={tilkommenInntekt.ekskluderteUkedager}
                        />
                    </VStack>
                </HStack>
            </Box>
            {showFjernModal && (
                <FjernTilkommenInntektModal
                    tilkommenInntekt={tilkommenInntekt}
                    fødselsnummer={person?.fodselsnummer}
                    onClose={() => setShowFjernModal(false)}
                />
            )}
        </>
    );
};
