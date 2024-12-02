import React from 'react';

import { BodyShort, Box, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment, Maybe, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { visTilkommenInntektEndreKnapp } from '@utils/featureToggles';

interface TilkommenAGHeaderProps {
    person: PersonFragment;
    arbeidsgiver: Maybe<ArbeidsgiverFragment>;
    periode: NyttInntektsforholdPeriodeFragment;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const TilkommenAGHeader = ({ person, arbeidsgiver, periode, editing, setEditing }: TilkommenAGHeaderProps) => {
    const harBeslutteroppgave = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    if (arbeidsgiver == null) return null;

    return (
        <HStack justify="space-between" marginBlock="0 4">
            <HStack gap="2" align="center">
                <Box maxWidth="230px">
                    <Arbeidsgivernavn
                        arbeidsgivernavn={arbeidsgiver.navn}
                        organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    />
                </Box>
                <HStack align="center">
                    <BodyShort weight="semibold" size="large">
                        (
                    </BodyShort>
                    <AnonymizableText weight="semibold">{arbeidsgiver?.organisasjonsnummer}</AnonymizableText>
                    <Tooltip content="Kopier organiasasjonsnummer">
                        <CopyButton copyText={arbeidsgiver?.organisasjonsnummer} size="small" />
                    </Tooltip>
                    <BodyShort weight="semibold" size="large">
                        )
                    </BodyShort>
                </HStack>
                <Kilde type={'Soknad'}>SØ</Kilde>
                {!harBeslutteroppgave && visTilkommenInntektEndreKnapp && (
                    <EditButton
                        isOpen={editing}
                        openText="Avbryt"
                        closedText="Endre"
                        onOpen={() => setEditing(true)}
                        onClose={() => setEditing(false)}
                    />
                )}
            </HStack>
        </HStack>
    );
};
