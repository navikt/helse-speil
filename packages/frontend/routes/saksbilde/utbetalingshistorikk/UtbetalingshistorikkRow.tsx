import dayjs from 'dayjs';
import React from 'react';

import { Bold } from '@components/Bold';
import { Arbeidsgiveroppdrag, Oppdrag, Personoppdrag, Spennoppdrag } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { Cell } from './Cell';
import { getTom } from './utbetalingshistorikkUtils';

const getFom = (oppdrag: Spennoppdrag): Dayjs | undefined =>
    oppdrag.linjer.length > 0
        ? oppdrag.linjer.reduce((first, { fom }) => (first.isAfter(dayjs(fom)) ? dayjs(fom) : first), dayjs())
        : undefined;

const isPersonoppdrag = (oppdrag: Spennoppdrag): oppdrag is Personoppdrag =>
    (oppdrag as Personoppdrag).fodselsnummer !== undefined;

interface UtbetalingshistorikkRowProps {
    oppdrag: Personoppdrag | Arbeidsgiveroppdrag;
    status: Oppdrag['status'];
    type: Oppdrag['type'];
    annulleringButton: React.ReactNode;
    readOnly: boolean;
    erBeslutteroppgave: boolean;
}

export const UtbetalingshistorikkRow: React.FC<UtbetalingshistorikkRowProps> = ({
    oppdrag,
    status,
    type,
    annulleringButton,
    readOnly,
    erBeslutteroppgave,
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
                <Bold>{somPenger(totalt)}</Bold>
            </Cell>
            <Cell>
                <Bold>{status}</Bold>
            </Cell>
            <Cell>
                <Bold>{type}</Bold>
            </Cell>
            {!readOnly && !erBeslutteroppgave ? <Cell>{annulleringButton}</Cell> : <Cell />}
        </tr>
    );
};
