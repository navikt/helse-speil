import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../utils/date';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

const Begrunnelse = styled(BodyShort)`
    max-width: 300px;
`;

type ArbeidsforholdEndring = {
    skjæringstidspunkt: DateString;
    deaktivert: boolean;
    forklaring: string;
    begrunnelse: string;
    saksbehandlerIdent: string;
    timestamp: TimestampString;
};

interface EndringsloggOverstyrtArbeidsforholdProps extends ModalProps {
    endringer: ArbeidsforholdEndring[];
}

export const EndringsloggOverstyrtArbeidsforhold: React.FC<EndringsloggOverstyrtArbeidsforholdProps> = ({
    endringer,
    ...modalProps
}) => (
    <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
        <thead>
            <tr>
                <th>Dato</th>
                <th>Arbeidsforhold skal inngå i beregning</th>
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
                        <td>{it.deaktivert ? 'Skal ikke inngå' : 'Skal inngå'}</td>
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
