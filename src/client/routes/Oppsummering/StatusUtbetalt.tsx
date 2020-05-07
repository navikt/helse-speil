import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

const StatusUtbetalt = () => {
    return (
        <div>
            <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
            <Normaltekst>
                {/*{'Er det feil i utbetalingen er det mulig å '}*/}
                {/*<Lenkeknapp onClick={() => setAnnulleringsmodalOpen(true)}>*/}
                {/*    annullere utbetalingen fra oppdragssystemet*/}
                {/*</Lenkeknapp>*/}
            </Normaltekst>
        </div>
    );
};

export default StatusUtbetalt;
