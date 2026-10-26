import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table, VStack } from '@navikt/ds-react';

import { LikestiltYtelseVilkårsrad } from '@saksbilde/vilkår/opptjening/LikestiltYtelseVilkårsrad';
import { OpptjeningVilkårsrad } from '@saksbilde/vilkår/opptjening/OpptjeningVilkårsrad';
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
                                            <VStack as="ul" padding="space-0" margin="space-0">
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
    switch (detaljer.type) {
        case 'vilkår':
            return (
                <OpptjeningVilkårsrad
                    vilkårskode={detaljer.vurdering.vilkårskode}
                    vurdering={detaljer.vurdering}
                    visDetaljer
                />
            );
        case 'likestiltYtelse':
            return (
                <LikestiltYtelseVilkårsrad
                    vurderingFor={(vilkårskode) =>
                        detaljer.vurderinger.find((vurdering) => vurdering.vilkårskode === vilkårskode)
                    }
                    visDetaljer
                />
            );
    }
}
