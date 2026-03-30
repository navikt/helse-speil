import React, { ReactElement } from 'react';

import { ClockIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { TabButton } from '@components/TabButton';
import { useShowHistorikkState, useShowHøyremenyState } from '@saksbilde/historikk/state';

export const TilkommenInntektHistorikkmeny = (): ReactElement => {
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny, setShowHøyremeny] = useShowHøyremenyState();

    const toggleHistorikk = () => {
        const next = !(showHistorikk && showHøyremeny);
        setShowHistorikk(next);
        setShowHøyremeny(next);
    };

    return (
        <VStack align="center" className="z-1 ml-auto w-[58px] border-l border-ax-border-neutral-subtle">
            <TabButton active={showHistorikk && showHøyremeny} onClick={toggleHistorikk} title="Historikk">
                <ClockIcon title="Historikk" fontSize="18px" />
            </TabButton>
        </VStack>
    );
};
