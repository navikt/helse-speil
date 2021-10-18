import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../utils/date';
import { somPenger } from '../utils/locale';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

const Begrunnelse = styled(BodyShort)`
    max-width: 300px;
`;

type Inntektsendring = {
    skjæringstidspunkt: DateString;
    månedligInntekt: number;
    forklaring: string;
    begrunnelse: string;
    saksbehandlerIdent: string;
    timestamp: TimestampString;
};

interface EndringsloggOverstyrtInntektProps extends ModalProps {
    endringer: Inntektsendring[];
}

export const EndringsloggOverstyrtInntekt: React.FC<EndringsloggOverstyrtInntektProps> = ({
    endringer,
    ...modalProps
}) => (
    <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
        <thead>
            <tr>
                <th>Dato</th>
                <th>Månedsbeløp</th>
                <th>Skjæringstidspunkt</th>
                <th>Begrunnelse</th>
                <th>Forklaring</th>
                <th>Kilde</th>
            </tr>
        </thead>
        <tbody>
            {[...endringer]
                .sort((a, b) => dayjs(b.timestamp).diff(a.timestamp, 'millisecond'))
                .map((it, i) => (
                    <tr key={i}>
                        <td>{dayjs(it.timestamp).format(NORSK_DATOFORMAT)}</td>
                        <td>{somPenger(it.månedligInntekt)}</td>
                        <td>{dayjs(it.skjæringstidspunkt).format(NORSK_DATOFORMAT)}</td>
                        <td>
                            <Begrunnelse as="p">{it.begrunnelse}</Begrunnelse>
                        </td>
                        <td>
                            <Begrunnelse as="p">{it.forklaring}</Begrunnelse>
                        </td>
                        <td>{it.saksbehandlerIdent}</td>
                    </tr>
                ))}
        </tbody>
    </TableModal>
);
