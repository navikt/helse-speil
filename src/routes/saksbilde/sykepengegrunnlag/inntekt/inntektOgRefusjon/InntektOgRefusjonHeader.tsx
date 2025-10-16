import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Inntektskilde } from '@io/graphql';
import { ArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';

interface InntektOgRefusjonHeaderProps {
    arbeidsgiverReferanse: ArbeidsgiverReferanse;
    kilde: Inntektskilde.Aordningen | 'AINNTEKT';
}

export const InntektOgRefusjonHeader = ({ arbeidsgiverReferanse, kilde }: InntektOgRefusjonHeaderProps) => (
    <HStack marginBlock="5 6" gap="3" align="center">
        <Arbeidsgiverikon />
        <Inntektsforholdnavn inntektsforholdReferanse={arbeidsgiverReferanse} maxWidth="190px" />
        <HStack align="center">
            <BodyShort>(</BodyShort>
            <AnonymizableText>{arbeidsgiverReferanse.organisasjonsnummer}</AnonymizableText>
            <Tooltip content="Kopier organisasjonsnummer">
                <CopyButton copyText={arbeidsgiverReferanse.organisasjonsnummer} size="small" />
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
