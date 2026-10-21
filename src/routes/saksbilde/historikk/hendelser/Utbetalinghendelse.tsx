import React, { ReactElement } from 'react';

import { ApiUtbetalingtype } from '@io/rest/generated/spesialist.schemas';
import { HistorikkCheckmarkCircleIkon, HistorikkXMarkOctagonIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { UtbetalinghendelseObject } from '@typer/historikk';

const getTittel = (type: ApiUtbetalingtype, automatisk: boolean, godkjent: boolean): string => {
    if (godkjent) {
        return ApiUtbetalingtype.REVURDERING === type ? 'Revurdering godkjent' : 'Godkjent';
    } else if (automatisk) {
        return 'Kunne ikke behandles her';
    } else {
        return ApiUtbetalingtype.ANNULLERING === type ? 'Annullert' : 'Ikke godkjent';
    }
};

type UtbetalinghendelseProps = {
    hendelse: UtbetalinghendelseObject;
};

export const Utbetalinghendelse = ({
    hendelse: { automatisk, godkjent, utbetalingstype, saksbehandler, timestamp },
}: UtbetalinghendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={godkjent ? <HistorikkCheckmarkCircleIkon /> : <HistorikkXMarkOctagonIkon />}
            title={getTittel(utbetalingstype, automatisk, godkjent)}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        />
    );
};
