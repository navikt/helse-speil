import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

export const BehandlingsstatistikkError = (): ReactElement => {
    return (
        <Alert size="small" variant="error">
            Vi klarte ikke hente behandlingsstatistikken.
            <br />
            Prøv igjen senere eller{' '}
            <a href="https://nav-it.slack.com/archives/C014X6VBFPV" target="_blank">
                kontakt en utvikler
            </a>{' '}
            hvis problemet fortsetter.
        </Alert>
    );
};
