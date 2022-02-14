import React from 'react';
import dayjs from 'dayjs';

import { Cell } from './Cell';
import { Bold } from '../../../components/Bold';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { toKronerOgØre } from '../../../utils/locale';

import { Arbeidsgiveroppdrag, Oppdrag, Personoppdrag, Spennoppdrag } from '@io/graphql';

const getFom = (oppdrag: Spennoppdrag): Dayjs | undefined =>
    oppdrag.linjer.length > 0
        ? oppdrag.linjer.reduce((first, { fom }) => (first.isAfter(dayjs(fom)) ? dayjs(fom) : first), dayjs())
        : undefined;

const getTom = (oppdrag: Spennoppdrag): Dayjs | undefined =>
    oppdrag.linjer.length > 0
        ? oppdrag.linjer.reduce((last, { tom }) => (last.isBefore(dayjs(tom)) ? dayjs(tom) : last), dayjs(0))
        : undefined;

const isPersonoppdrag = (oppdrag: Spennoppdrag): oppdrag is Personoppdrag =>
    (oppdrag as Personoppdrag).fodselsnummer !== undefined;

interface UtbetalingshistorikkRowProps {
    oppdrag: Personoppdrag | Arbeidsgiveroppdrag;
    status: Oppdrag['status'];
    type: Oppdrag['type'];
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
    const totalt = oppdrag.linjer.reduce((sum, { totalbelop }) => sum + (totalbelop ?? 0), 0);
    const mottaker = isPersonoppdrag(oppdrag) ? oppdrag.fodselsnummer : oppdrag.organisasjonsnummer;

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
                <Bold>{mottaker}</Bold>
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
