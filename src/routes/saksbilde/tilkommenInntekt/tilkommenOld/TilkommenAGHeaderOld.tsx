import dayjs from 'dayjs';
import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment, Maybe, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { visTilkommenInntektEndreKnapp } from '@utils/featureToggles';

interface TilkommenAGHeaderProps {
    person: PersonFragment;
    arbeidsgiver: Maybe<ArbeidsgiverFragment>;
    periode: NyttInntektsforholdPeriodeFragment;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const TilkommenAGHeaderOld = ({
    person,
    arbeidsgiver,
    periode,
    editing,
    setEditing,
}: TilkommenAGHeaderProps) => {
    const harBeslutteroppgave = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const harPeriodeTilGodkjenningTidligereEnnTilkommenPeriode = dayjs(periodeTilGodkjenning?.tom).isBefore(
        periode.fom,
    );

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
                {!harBeslutteroppgave &&
                    visTilkommenInntektEndreKnapp &&
                    !harPeriodeTilGodkjenningTidligereEnnTilkommenPeriode &&
                    (!editing ? (
                        <Button
                            onClick={() => setEditing(true)}
                            size="xsmall"
                            variant="secondary"
                            icon={<PersonPencilIcon />}
                        >
                            Endre
                        </Button>
                    ) : (
                        <Button onClick={() => setEditing(false)} size="xsmall" variant="tertiary" icon={<XMarkIcon />}>
                            Avbryt
                        </Button>
                    ))}
            </HStack>
        </HStack>
    );
};
