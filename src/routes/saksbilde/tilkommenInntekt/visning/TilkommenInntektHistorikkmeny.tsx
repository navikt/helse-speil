import React, { ReactElement } from 'react';

import { ClockIcon } from '@navikt/aksel-icons';
import { VStack } from '@navikt/ds-react';

import { TabButton } from '@components/TabButton';
import { useShowHistorikkState, useShowHøyremenyState } from '@saksbilde/historikk/state';

export const TilkommenInntektHistorikkmeny = (): ReactElement => {
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny, setShowHøyremeny] = useShowHøyremenyState();

    function toggleHistorikk() {
        const next = !(showHistorikk && showHøyremeny);
        setShowHistorikk(next);
        setShowHøyremeny(next);
    }

    return (
        <VStack align="center" className="z-1 ml-auto w-[58px] border-l border-ax-border-neutral-subtle">
            <TabButton label="Historikk" active={showHistorikk && showHøyremeny} onClick={toggleHistorikk}>
                <ClockIcon aria-hidden fontSize="18px" />
            </TabButton>
        </VStack>
    );
};
