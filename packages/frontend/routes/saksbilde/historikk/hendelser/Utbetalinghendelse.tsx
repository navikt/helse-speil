import React from 'react';

import { Utbetalingtype } from '@io/graphql';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

const getTitle = (type: Utbetalingtype, automatisk: boolean, godkjent: boolean): string => {
    if (automatisk) {
        return godkjent ? 'Godkjent' : 'Kunne ikke behandles her';
    }

    switch (type) {
        case Utbetalingtype.Revurdering: {
            return 'Revurdering godkjent';
        }
        case Utbetalingtype.Annullering: {
            return 'Annullert';
        }
        case Utbetalingtype.Etterutbetaling:
        case Utbetalingtype.Feriepenger:
        case Utbetalingtype.Ukjent:
        case Utbetalingtype.Utbetaling:
        default: {
            return 'Godkjent';
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
        <Hendelse title={getTitle(utbetalingstype, automatisk, godkjent)}>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
