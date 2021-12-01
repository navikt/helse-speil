import React from 'react';
import { Alert, BodyLong } from '@navikt/ds-react';

export const BrukerutbetalingInfoMessage = () => (
    <Alert variant="warning">
        <BodyLong>
            Systemet beregner at noe sykepenger skal utbetales til den sykmeldte. Dette kan skyldes en feil. Undersøk om
            det er riktig at den sykmeldte skal ha utbetalt sykepenger. Dette må undersøkes helt tilbake til siste
            skjæringstidspunkt. Saken må avvises fra Speil uansett om beregningen er riktig eller feil, og den må
            eventuelt behandles videre i Gosys/Infotrygd.
        </BodyLong>
    </Alert>
);
