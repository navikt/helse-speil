import React from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

export const Annulleringsvarsel = () => (
    <AlertStripe type="advarsel" form="inline">
        Hvis du annullerer, vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i Infotrygd.
    </AlertStripe>
);
