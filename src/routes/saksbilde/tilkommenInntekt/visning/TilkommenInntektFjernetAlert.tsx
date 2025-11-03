import React from 'react';

import { Alert, BodyShort, Heading } from '@navikt/ds-react';

import { ApiTilkommenInntektEvent } from '@io/rest/generated/spesialist.schemas';
import { getFormattedDatetimeString } from '@utils/date';

export const TilkommenInntektFjernetAlert = ({
    tilkommenInntektEvents,
}: {
    tilkommenInntektEvents: ApiTilkommenInntektEvent[];
}) => {
    const fjernetEvent = tilkommenInntektEvents.findLast((event) => event.type == 'ApiTilkommenInntektFjernetEvent');
    return (
        <Alert variant="info" size="small" style={{ width: '340px' }}>
            <Heading size="xsmall" level="4">
                Perioden er fjernet
            </Heading>
            <BodyShort>Fjernet av: {fjernetEvent?.metadata?.utfortAvSaksbehandlerIdent}</BodyShort>
            <BodyShort>Tidspunkt: {getFormattedDatetimeString(fjernetEvent?.metadata?.tidspunkt)}</BodyShort>
        </Alert>
    );
};
