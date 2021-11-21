import React from 'react';

import { Button } from '@navikt/ds-react';

import { Bold } from '../../../components/Bold';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { Cell } from './Cell';
import type { Oppdrag } from './Utbetalingshistorikk';

interface UtbetalingshistorikkRowProps {
    oppdrag: Oppdrag;
    status: UtbetalingshistorikkUtbetaling['status'];
    type: UtbetalingshistorikkUtbetaling['type'];
    totalbeløp: number | null;
    annulleringErForespurt: boolean;
    onSetTilAnnullering?: () => void;
}

export const UtbetalingshistorikkRow = ({
    oppdrag,
    status,
    type,
    totalbeløp,
    annulleringErForespurt,
    onSetTilAnnullering,
}: UtbetalingshistorikkRowProps) => {
    return (
        <tr>
            <Cell>
                <Bold>{oppdrag.utbetalingslinjer[0]?.fom.format(NORSK_DATOFORMAT_KORT)}</Bold>
            </Cell>
            <Cell>
                <Bold>
                    {oppdrag.utbetalingslinjer[oppdrag.utbetalingslinjer.length - 1]?.tom.format(NORSK_DATOFORMAT_KORT)}
                </Bold>
            </Cell>
            <Cell>
                <Bold>{oppdrag.fagsystemId}</Bold>
            </Cell>
            <Cell>
                <Bold>{totalbeløp ? `${totalbeløp} kr` : '-'}</Bold>
            </Cell>
            <Cell>
                <Bold>{status}</Bold>
            </Cell>
            <Cell>
                <Bold>{type}</Bold>
            </Cell>
            <Cell>
                {annulleringErForespurt ? (
                    'Utbetalingen er forespurt annullert'
                ) : onSetTilAnnullering ? (
                    <Button size="small" onClick={onSetTilAnnullering}>
                        Annuller
                    </Button>
                ) : null}
            </Cell>
        </tr>
    );
};
