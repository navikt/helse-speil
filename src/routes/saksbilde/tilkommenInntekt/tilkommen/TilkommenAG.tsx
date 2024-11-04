import React, { useState } from 'react';

import { BodyShort, Box, HGrid, HStack, HelpText, VStack } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { ArbeidsgiverFragment, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { EditableTilkommenAG } from '@saksbilde/tilkommenInntekt/tilkommen/EditableTilkommenAG';
import { TilkommenAGHeader } from '@saksbilde/tilkommenInntekt/tilkommen/TilkommenAGHeader';
import { useLokaltMånedsbeløp } from '@state/arbeidsgiver';
import { somPenger } from '@utils/locale';

interface TilkommenAGProps {
    person: PersonFragment;
    periode: NyttInntektsforholdPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const TilkommenAG = ({ person, periode, arbeidsgiver }: TilkommenAGProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(arbeidsgiver.organisasjonsnummer, periode.skjaeringstidspunkt);

    return (
        <VStack>
            <Box
                background="surface-subtle"
                borderWidth="0 0 0 3"
                style={{ borderColor: editing ? 'var(--a-border-action)' : 'transparent' }}
                paddingBlock="4"
                paddingInline={editing ? '10' : '6'}
                marginInline={editing ? '0' : '4'}
                borderRadius={editing ? undefined : 'medium'}
                minWidth="390px"
                maxWidth={editing ? undefined : '730px'}
            >
                <TilkommenAGHeader
                    person={person}
                    arbeidsgiver={arbeidsgiver}
                    periode={periode}
                    editing={editing}
                    setEditing={setEditing}
                />

                <Box marginInline="7 0" minWidth="390px" maxWidth="730px">
                    {editing ? (
                        <EditableTilkommenAG
                            person={person}
                            arbeidsgiver={arbeidsgiver}
                            periode={periode}
                            lokaltMånedsbeløp={lokaltMånedsbeløp}
                            close={() => setEditing(false)}
                            onEndre={setEndret}
                        />
                    ) : (
                        <HGrid columns="150px auto" paddingBlock="1 0">
                            <BodyShort weight="semibold">Inntekt per måned</BodyShort>
                            <HStack justify="end" width="7rem">
                                {(endret || lokaltMånedsbeløp) && (
                                    <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                                )}
                                <BodyShort>{somPenger(periode.manedligBelop)}</BodyShort>
                            </HStack>
                            <BodyShort weight="semibold">Inntekt per dag</BodyShort>
                            <HStack gap="2">
                                <HStack justify="end" width="7rem">
                                    <BodyShort>{somPenger(periode.dagligBelop)}</BodyShort>
                                </HStack>
                                <HelpText>Ikke ferie, permisjon og andre ytelser</HelpText>
                            </HStack>
                        </HGrid>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};
