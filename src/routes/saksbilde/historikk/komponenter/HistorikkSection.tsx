import React, { PropsWithChildren } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

type HistorikkSectionProps = {
    tittel: string;
};

export const HistorikkSection = ({ tittel, children }: PropsWithChildren<HistorikkSectionProps>) => {
    return (
        <VStack>
            <BodyShort weight="semibold">{tittel}</BodyShort>
            {children}
        </VStack>
    );
};
