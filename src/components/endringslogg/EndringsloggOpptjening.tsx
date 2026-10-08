import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table } from '@navikt/ds-react';

import { Opptjeningsendring } from '@saksbilde/vilkår/opptjening/useOpptjeningshistorikk';
import { utfallstekst } from '@saksbilde/vilkår/vilkårsutfall';
import { getFormattedDatetimeString } from '@utils/date';

type EndringsloggOpptjeningProps = {
    onOpenChange: (open: boolean) => void;
    endringer: Opptjeningsendring[];
};

export function EndringsloggOpptjening({ endringer, onOpenChange }: EndringsloggOpptjeningProps): ReactElement {
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
                                <Table.HeaderCell>Vilkår</Table.HeaderCell>
                                <Table.HeaderCell>Vurdering</Table.HeaderCell>
                                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                                <Table.HeaderCell>Kilde</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {endringer.map((endring) => (
                                <Table.Row key={endring.id}>
                                    <Table.DataCell>{getFormattedDatetimeString(endring.tidspunkt)}</Table.DataCell>
                                    <Table.DataCell>{endring.vilkår}</Table.DataCell>
                                    <Table.DataCell>{utfallstekst(endring.utfall)}</Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort className="max-w-75">{endring.begrunnelse}</BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>{endring.kilde}</Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
