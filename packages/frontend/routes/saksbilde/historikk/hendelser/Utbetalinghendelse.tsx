import React from 'react';

import { Utbetalingtype } from '@io/graphql';

import { Hendelse } from './Hendelse';

const getTitle = (type: Utbetalingtype, automatisk: boolean, godkjent: boolean): string => {
    if (automatisk) {
        return godkjent ? 'Automatisk godkjent' : 'Kunne ikke behandles her';
    }

    switch (type) {
        case Utbetalingtype.Revurdering: {
            return 'Revurdert';
        }
        case Utbetalingtype.Annullering: {
            return 'Annullert';
        }
        case Utbetalingtype.Etterutbetaling:
        case Utbetalingtype.Feriepenger:
        case Utbetalingtype.Ukjent:
        case Utbetalingtype.Utbetaling:
        default: {
            return 'Sendt til utbetaling';
        }
    }
};

interface UtbetalinghendelseProps extends Omit<UtbetalinghendelseObject, 'type' | 'id'> {}

export const Utbetalinghendelse: React.FC<UtbetalinghendelseProps> = ({
    automatisk,
    godkjent,
    utbetalingstype,
    saksbehandler,
    timestamp,
}) => {
    return (
        <Hendelse title={getTitle(utbetalingstype, automatisk, godkjent)} ident={saksbehandler} timestamp={timestamp} />
    );
};
