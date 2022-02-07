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

export type Endringstype = 'Inntekt' | 'Arbeidsforhold';

type Endring = {
    skjæringstidspunkt: DateString;
    forklaring: string;
    begrunnelse: string;
    saksbehandlerIdent: string;
    timestamp: TimestampString;
    type: Endringstype;
};

type Inntektsendring = Endring & {
    månedligInntekt: number;
};

type Arbeidsforholdendring = Endring & {
    deaktivert: boolean;
};

interface EndringsloggOverstyrtInntektEllerArbeidsforholdProps extends ModalProps {
    inntektsendringer: Inntektsendring[];
    arbeidsforholdendringer: Arbeidsforholdendring[];
}

const somArbeidsforhold = (endring: Arbeidsforholdendring) =>
    endring.deaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen';

export const EndringsloggOverstyrtInntektEllerArbeidsforhold: React.FC<EndringsloggOverstyrtInntektEllerArbeidsforholdProps> =
    ({ inntektsendringer, arbeidsforholdendringer, ...modalProps }) => {
        const kunInntektsendringer = inntektsendringer.length > 0 && arbeidsforholdendringer.length === 0;

        return (
            <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
                <thead>
                    <tr>
                        <th>Dato</th>
                        <th>{kunInntektsendringer ? 'Månedsbeløp' : ''}</th>
                        <th>Skjæringstidspunkt</th>
                        <th>Begrunnelse</th>
                        <th>Forklaring</th>
                        <th>Kilde</th>
                    </tr>
                </thead>
                <tbody>
                    {[...inntektsendringer, ...arbeidsforholdendringer]
                        .sort((a, b) => dayjs(b.timestamp).diff(a.timestamp, 'millisecond'))
                        .map((it, i) => (
                            <tr key={i}>
                                <td>{dayjs(it.timestamp).format(NORSK_DATOFORMAT)}</td>
                                <td>
                                    {it.type === 'Inntekt'
                                        ? somPenger((it as Inntektsendring).månedligInntekt)
                                        : somArbeidsforhold(it as Arbeidsforholdendring)}
                                </td>
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
    };
