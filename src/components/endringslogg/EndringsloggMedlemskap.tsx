import { ReactElement } from 'react';

import { BodyShort, Dialog, Table, VStack } from '@navikt/ds-react';

import { Medlemskapsdetaljer } from '@saksbilde/vilkår/medlemskap/Medlemskap';
import { Medlemskapsendring } from '@saksbilde/vilkår/medlemskap/useMedlemskapshistorikk';
import { utfallFraStatus } from '@saksbilde/vilkår/medlemskap/useMedlemskapsvurdering';
import { utfallstekst } from '@saksbilde/vilkår/vilkårsutfall';
import { getFormattedDatetimeString } from '@utils/date';

type EndringsloggMedlemskapProps = {
    onOpenChange: (open: boolean) => void;
    endringer: Medlemskapsendring[];
};

export function EndringsloggMedlemskap({ endringer, onOpenChange }: EndringsloggMedlemskapProps): ReactElement {
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
                                    expansionDisabled={!endring.harDetaljer}
                                    content={
                                        endring.harDetaljer && (
                                            <VStack gap="space-8">
                                                <Medlemskapsdetaljer vurdering={endring.vurdering} />
                                            </VStack>
                                        )
                                    }
                                >
                                    <Table.DataCell>{getFormattedDatetimeString(endring.tidspunkt)}</Table.DataCell>
                                    <Table.DataCell>{endring.vilkår}</Table.DataCell>
                                    <Table.DataCell>
                                        {utfallstekst(utfallFraStatus(endring.vurdering.status))}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort className="max-w-75">{endring.begrunnelse}</BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {endring.kildeErSaksbehandler ? (
                                            <span data-sensitive>{endring.kilde}</span>
                                        ) : (
                                            endring.kilde
                                        )}
                                    </Table.DataCell>
                                </Table.ExpandableRow>
                            ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
