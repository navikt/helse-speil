import React, { ComponentPropsWithRef, ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { TimelineDateLabels } from '@saksbilde/tidslinje/timeline/TimelineDateLabels';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';

export function TimelineScrollableRows({ ref, children }: ComponentPropsWithRef<'div'>): ReactElement {
    const { width } = useTimelineContext();

    return (
        <VStack ref={ref} className="relative -ml-2 grow overflow-x-scroll px-2 pb-4" style={{ width }}>
            <TimelineDateLabels />
            {children}
        </VStack>
    );
}
