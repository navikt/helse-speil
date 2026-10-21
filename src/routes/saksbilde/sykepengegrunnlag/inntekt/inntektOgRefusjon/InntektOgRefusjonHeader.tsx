import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Kilde } from '@components/Kilde';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { ApiInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { ArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';

interface InntektOgRefusjonHeaderProps {
    arbeidsgiverReferanse: ArbeidsgiverReferanse;
    kilde: typeof ApiInntektskilde.AORDNINGEN | 'AINNTEKT';
}

export const InntektOgRefusjonHeader = ({ arbeidsgiverReferanse, kilde }: InntektOgRefusjonHeaderProps) => (
    <HStack marginBlock="space-20 space-24" gap="space-12" align="center">
        <Arbeidsgiverikon />
        <Inntektsforholdnavn inntektsforholdReferanse={arbeidsgiverReferanse} maxWidth="190px" />
        <HStack align="center">
            <BodyShort>(</BodyShort>
            <BodyShort data-sensitive>{arbeidsgiverReferanse.organisasjonsnummer}</BodyShort>
            <Tooltip content="Kopier virksomhetsnummer">
                <CopyButton copyText={arbeidsgiverReferanse.organisasjonsnummer} size="small" />
            </Tooltip>
            <BodyShort>)</BodyShort>
        </HStack>
        {kilde === ApiInntektskilde.AORDNINGEN ? (
            <Kilde type={ApiInntektskilde.AORDNINGEN}>AO</Kilde>
        ) : (
            <Kilde type="AINNTEKT">AA</Kilde>
        )}
    </HStack>
);
