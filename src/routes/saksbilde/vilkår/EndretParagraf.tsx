import React, { ReactElement } from 'react';

import { BodyShort, HStack, Tooltip } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';

export function EndretParagraf(): ReactElement {
    return (
        <HStack align="center" gap="space-8">
            <Tooltip content="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G">
                <HStack align="center">
                    <Advarselikon
                        alt="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G"
                        height={16}
                        width={16}
                    />
                </HStack>
            </Tooltip>
            <BodyShort size="small">
                <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
            </BodyShort>
        </HStack>
    );
}
