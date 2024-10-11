import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Inntektskilde } from '@io/graphql';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';

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
        <Arbeidsgivernavn arbeidsgivernavn={arbeidsgivernavn} />
        <HStack align="center">
            <BodyShort weight="semibold" size="large">
                (
            </BodyShort>
            <AnonymizableText weight="semibold">{organisasjonsnummer}</AnonymizableText>
            <Tooltip content="Kopier organiasasjonsnummer">
                <CopyButton copyText={organisasjonsnummer} size="small" />
            </Tooltip>
            <BodyShort weight="semibold" size="large">
                )
            </BodyShort>
        </HStack>
        {kilde === Inntektskilde.Aordningen ? (
            <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
        ) : (
            <Kilde type="AINNTEKT">AA</Kilde>
        )}
    </HStack>
);
