import React, { ReactElement } from 'react';

import { Alert, BodyShort, Heading } from '@navikt/ds-react';

import { ApiGraderteAndreYtelserEvent } from '@io/rest/generated/spesialist.schemas';
import { getFormattedDatetimeString } from '@utils/date';

export function AndreYtelserFjernetAlert({ events }: { events: ApiGraderteAndreYtelserEvent[] }): ReactElement {
    const fjernetEvent = events.findLast((event) => event.type === 'ApiGraderteAndreYtelserFjernetEvent');
    return (
        <Alert variant="info" size="small" className="w-[340px]">
            <Heading size="xsmall" level="4">
                Ytelsen er fjernet
            </Heading>
            {fjernetEvent && (
                <>
                    <BodyShort>Fjernet av: {fjernetEvent.metadata.utfortAvSaksbehandlerIdent}</BodyShort>
                    <BodyShort>Tidspunkt: {getFormattedDatetimeString(fjernetEvent.metadata.tidspunkt)}</BodyShort>
                </>
            )}
            <BodyShort>Ytelsen inngår ikke i beregningen. Du kan legge den til igjen.</BodyShort>
        </Alert>
    );
}
