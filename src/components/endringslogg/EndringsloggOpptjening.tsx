import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table, VStack } from '@navikt/ds-react';

import { Opptjeningsdetaljer } from '@saksbilde/vilkår/opptjening/Opptjeningsdetaljer';
import { Endringsdetaljer, Opptjeningsendring } from '@saksbilde/vilkår/opptjening/useOpptjeningshistorikk';
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
                                <Table.HeaderCell />
                                <Table.HeaderCell>Dato</Table.HeaderCell>
                                <Table.HeaderCell>Vilkår</Table.HeaderCell>
                                <Table.HeaderCell>Vurdering</Table.HeaderCell>
                                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                                <Table.HeaderCell>Kilde</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {endringer.map((endring) => (
                                <Table.ExpandableRow
                                    key={endring.id}
                                    expansionDisabled={!endring.detaljer}
                                    content={
                                        endring.detaljer && (
                                            <VStack>
                                                <Endringsdetaljervisning detaljer={endring.detaljer} />
                                            </VStack>
                                        )
                                    }
                                >
                                    <Table.DataCell>{getFormattedDatetimeString(endring.tidspunkt)}</Table.DataCell>
                                    <Table.DataCell>{endring.vilkår}</Table.DataCell>
                                    <Table.DataCell>{utfallstekst(endring.utfall)}</Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort className="max-w-75">{endring.begrunnelse}</BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>{endring.kilde}</Table.DataCell>
                                </Table.ExpandableRow>
                            ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}

function Endringsdetaljervisning({ detaljer }: { detaljer: Endringsdetaljer }): ReactElement {
    return (
        <Opptjeningsdetaljer
            vurderingFor={(vilkårskode) =>
                detaljer.vurderinger.find((vurdering) => vurdering.vilkårskode === vilkårskode)
            }
            visDetaljer
        />
    );
}
