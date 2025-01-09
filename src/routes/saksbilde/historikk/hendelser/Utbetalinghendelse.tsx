import React, { ReactElement } from 'react';

import { Utbetalingtype } from '@io/graphql';
import { HistorikkCheckmarkCircleIkon, HistorikkXMarkOctagonIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { UtbetalinghendelseObject } from '@typer/historikk';

const getTittel = (type: Utbetalingtype, automatisk: boolean, godkjent: boolean): string => {
    if (godkjent) {
        return Utbetalingtype.Revurdering === type ? 'Revurdering godkjent' : 'Godkjent';
    } else if (automatisk) {
        return 'Kunne ikke behandles her';
    } else {
        return Utbetalingtype.Annullering === type ? 'Annullert' : 'Ikke godkjent';
    }
};

type UtbetalinghendelseProps = Omit<UtbetalinghendelseObject, 'type' | 'id'>;

export const Utbetalinghendelse = ({
    automatisk,
    godkjent,
    utbetalingstype,
    saksbehandler,
    timestamp,
}: UtbetalinghendelseProps): ReactElement => (
    <Historikkhendelse
        icon={godkjent ? <HistorikkCheckmarkCircleIkon /> : <HistorikkXMarkOctagonIkon />}
        title={getTittel(utbetalingstype, automatisk, godkjent)}
        timestamp={timestamp}
        saksbehandler={saksbehandler}
        aktiv={false}
    />
);
