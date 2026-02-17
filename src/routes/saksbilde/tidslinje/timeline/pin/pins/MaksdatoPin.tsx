import dayjs from 'dayjs';
import { ReactElement } from 'react';

import { BodyShort, HGrid } from '@navikt/ds-react';

import { TimelinePin } from '@saksbilde/tidslinje/timeline/pin/TimelinePin';
import { getFormattedDateString } from '@utils/date';

interface MaksdatoPinProps {
    maksdato: string | undefined;
}

export function MaksdatoPin({ maksdato }: MaksdatoPinProps): ReactElement | null {
    if (!maksdato) return null;

    return (
        <TimelinePin date={dayjs(maksdato)}>
            <HGrid columns="auto auto" gap="space-4 space-16">
                <BodyShort size="small">Maksdato:</BodyShort>
                <BodyShort size="small">{getFormattedDateString(maksdato)}</BodyShort>
            </HGrid>
        </TimelinePin>
    );
}
