import React from 'react';
import { Alert, BodyLong } from '@navikt/ds-react';

export const BrukerutbetalingInfoMessage = () => (
    <Alert variant="warning">
        <BodyLong>
            Det er beregnet at det er helt/delvis utbetaling til sykmeldt. Undersøk om saken er beregnet riktig tilbake
            i tid og behandle videre i Infotrygd.
        </BodyLong>
    </Alert>
);
