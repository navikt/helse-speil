'use client';

import React, { ReactElement, useState } from 'react';

import { Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { AndreYtelserSkjema } from '@saksbilde/tilkommenInntekt/skjema/AndreYtelserSkjema';
import { LeggTilTilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/LeggTilTilkommenInntektSkjemaV2';

type LeggTilType = 'tilkommen-inntekt' | 'andre-ytelser';

export const LeggTilTilkommenInntektEllerAndreYtelserView = (): ReactElement => {
    const [type, setType] = useState<LeggTilType>('tilkommen-inntekt');

    return (
        <Box
            background="neutral-soft"
            borderWidth="0 0 0 3"
            borderColor="accent"
            paddingInline="space-40"
            paddingBlock="space-16"
            marginBlock="space-16"
            width="fit-content"
            minWidth="calc(var(--ax-space-128) * 4)"
            maxWidth="100%"
            style={{ marginInlineEnd: 'auto' }}
        >
            <VStack gap="space-16">
                <RadioGroup
                    legend="Legg til periode"
                    size="small"
                    value={type}
                    onChange={(val) => setType(val as LeggTilType)}
                >
                    <Radio value="tilkommen-inntekt">Tilkommen inntekt</Radio>
                    <Radio value="andre-ytelser">Andre ytelser</Radio>
                </RadioGroup>
                {type === 'tilkommen-inntekt' ? <LeggTilTilkommenInntektSkjema /> : <AndreYtelserSkjema />}
            </VStack>
        </Box>
    );
};
