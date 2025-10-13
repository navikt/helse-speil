import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Arbeidsgivernavn } from '@components/Inntektsforholdnavn';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Inntektskilde } from '@io/graphql';

interface InntektOgRefusjonHeaderProps {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    kilde: Inntektskilde.Aordningen | 'AINNTEKT';
}

export const InntektOgRefusjonHeader = ({
    arbeidsgivernavn,
    organisasjonsnummer,
    kilde,
}: InntektOgRefusjonHeaderProps) => (
    <HStack marginBlock="5 6" gap="3" align="center">
        <Arbeidsgiverikon />
        <Arbeidsgivernavn identifikator={organisasjonsnummer} navn={arbeidsgivernavn} maxWidth="190px" />
        <HStack align="center">
            <BodyShort>(</BodyShort>
            <AnonymizableText>{organisasjonsnummer}</AnonymizableText>
            <Tooltip content="Kopier organisasjonsnummer">
                <CopyButton copyText={organisasjonsnummer} size="small" />
            </Tooltip>
            <BodyShort>)</BodyShort>
        </HStack>
        {kilde === Inntektskilde.Aordningen ? (
            <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
        ) : (
            <Kilde type="AINNTEKT">AA</Kilde>
        )}
    </HStack>
);
