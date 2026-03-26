import React, { ReactElement } from 'react';

import { Dialog, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

type EndringsloggDagerProps = {
    onOpenChange: (open: boolean) => void;
    endringer: OverstyringerPrDag[];
};

export function EndringsloggDager({ endringer, onOpenChange }: EndringsloggDagerProps): ReactElement {
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
                                <Table.HeaderCell>Dato</Table.HeaderCell>
                                <Table.HeaderCell>Dagtype</Table.HeaderCell>
                                <Table.HeaderCell>Grad</Table.HeaderCell>
                                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                                <Table.HeaderCell>Kilde</Table.HeaderCell>
                                <Table.HeaderCell>Endret dato og tidspunkt</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {endringer
                                .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                                .map(({ begrunnelse, saksbehandler, timestamp, grad, fraGrad, dag, dato }, i) => (
                                    <Table.Row key={i}>
                                        <Table.DataCell>{getFormattedDateString(dato)}</Table.DataCell>
                                        <Table.DataCell>{dag.visningstekst}</Table.DataCell>
                                        <Table.DataCell>
                                            <span className="line-through">
                                                {typeof fraGrad === 'number' && fraGrad !== grad && `${fraGrad} %`}
                                            </span>{' '}
                                            {typeof grad === 'number' && `${grad} %`}
                                        </Table.DataCell>
                                        <Table.DataCell className="max-w-100 whitespace-normal!">
                                            {begrunnelse}
                                        </Table.DataCell>
                                        <Table.DataCell>{saksbehandler.ident ?? saksbehandler.navn}</Table.DataCell>
                                        <Table.DataCell>{getFormattedDatetimeString(timestamp)}</Table.DataCell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
