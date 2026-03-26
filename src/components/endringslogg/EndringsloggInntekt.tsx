import React, { ReactElement } from 'react';

import { Dialog, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Inntektoverstyring } from '@io/graphql';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';
import { somPenger } from '@utils/locale';

type EndringsloggInntektProps = {
    onOpenChange: (open: boolean) => void;
    endringer: Inntektoverstyring[];
};

export function EndringsloggInntekt({ endringer, onOpenChange }: EndringsloggInntektProps): ReactElement {
    return (
        <Dialog open onOpenChange={onOpenChange} aria-label="Endringslogg modal">
            <Dialog.Popup width="1200px">
                <Dialog.Header>
                    <Dialog.Title>Endringslogg</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Table zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Dato og tidspunkt</Table.HeaderCell>
                                <Table.HeaderCell>Månedsbeløp</Table.HeaderCell>
                                <Table.HeaderCell>Skjæringstidspunkt</Table.HeaderCell>
                                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                                <Table.HeaderCell>Forklaring</Table.HeaderCell>
                                <Table.HeaderCell>Kilde</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {endringer
                                .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                                .map((endring, i) => (
                                    <Table.Row key={i}>
                                        <Table.DataCell>{getFormattedDatetimeString(endring.timestamp)}</Table.DataCell>
                                        <Table.DataCell>
                                            <span className="line-through">
                                                {somPenger(endring.inntekt.fraManedligInntekt)}
                                            </span>{' '}
                                            {somPenger(endring.inntekt.manedligInntekt)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {getFormattedDateString(endring.inntekt.skjaeringstidspunkt)}
                                        </Table.DataCell>
                                        <Table.DataCell className="max-w-75 whitespace-normal!">
                                            {endring.inntekt.begrunnelse}
                                        </Table.DataCell>
                                        <Table.DataCell className="max-w-75 whitespace-normal!">
                                            {endring.inntekt.forklaring}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {endring.saksbehandler.ident ?? endring.saksbehandler.navn}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
