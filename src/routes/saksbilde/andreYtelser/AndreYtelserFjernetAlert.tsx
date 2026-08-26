import React, { ReactElement } from 'react';

import { Alert, BodyShort, Heading } from '@navikt/ds-react';

export const AndreYtelserFjernetAlert = (): ReactElement => (
    <Alert variant="info" size="small" style={{ width: '340px' }}>
        <Heading size="xsmall" level="4">
            Ytelsen er fjernet
        </Heading>
        <BodyShort>Ytelsen inngår ikke i beregningen. Du kan legge den til igjen.</BodyShort>
    </Alert>
);
