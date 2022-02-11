import React from 'react';
import { Cell } from './Cell';
import { Bold } from '../../../components/Bold';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { toKronerOgØre } from '../../../utils/locale';
import dayjs from 'dayjs';

const getFom = (oppdrag: ExternalPersonoppdrag | ExternalArbeidsgiveroppdrag): Dayjs | undefined =>
    oppdrag.utbetalingslinjer.length > 0
        ? oppdrag.utbetalingslinjer.reduce(
              (first, { fom }) => (first.isAfter(dayjs(fom)) ? dayjs(fom) : first),
              dayjs()
          )
        : undefined;

const getTom = (oppdrag: ExternalPersonoppdrag | ExternalArbeidsgiveroppdrag): Dayjs | undefined =>
    oppdrag.utbetalingslinjer.length > 0
        ? oppdrag.utbetalingslinjer.reduce((last, { tom }) => (last.isBefore(dayjs(tom)) ? dayjs(tom) : last), dayjs(0))
        : undefined;

interface UtbetalingshistorikkRowProps {
    oppdrag: ExternalPersonoppdrag | ExternalArbeidsgiveroppdrag;
    status: ExternalUtbetalingElement['status'];
    type: ExternalUtbetalingElement['type'];
    annulleringButton: React.ReactNode;
}

export const UtbetalingshistorikkRow: React.VFC<UtbetalingshistorikkRowProps> = ({
    oppdrag,
    status,
    type,
    annulleringButton,
}) => {
    const fom = getFom(oppdrag);
    const tom = getTom(oppdrag);
    const totalt = oppdrag.utbetalingslinjer.reduce((sum, { totalbeløp }) => sum + (totalbeløp ?? 0), 0);

    return (
        <tr>
            <Cell>
                <Bold>{fom?.format(NORSK_DATOFORMAT_KORT) ?? '-'}</Bold>
            </Cell>
            <Cell>
                <Bold>{tom?.format(NORSK_DATOFORMAT_KORT) ?? '-'}</Bold>
            </Cell>
            <Cell>
                <Bold>{oppdrag.fagsystemId}</Bold>
            </Cell>
            <Cell>
                <Bold>{oppdrag.mottaker}</Bold>
            </Cell>
            <Cell>
                <Bold>{totalt ? `${toKronerOgØre(totalt)} kr` : '-'}</Bold>
            </Cell>
            <Cell>
                <Bold>{status}</Bold>
            </Cell>
            <Cell>
                <Bold>{type}</Bold>
            </Cell>
            <Cell>{annulleringButton}</Cell>
        </tr>
    );
};
