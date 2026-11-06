import { ReactElement } from 'react';

import { Dialog, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { GraderteAndreYtelserEndring } from '@saksbilde/utbetaling/utbetalingstabell/graderteAndreYtelserEndringer';
import { visningstekstForGradertAnnenYtelse } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

type EndringsloggGraderteAndreYtelserProps = {
    onOpenChange: (open: boolean) => void;
    endringer: GraderteAndreYtelserEndring[];
};

export function EndringsloggGraderteAndreYtelser({
    endringer,
    onOpenChange,
}: EndringsloggGraderteAndreYtelserProps): ReactElement {
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
                                <Table.HeaderCell>Andre ytelser</Table.HeaderCell>
                                <Table.HeaderCell>Sykdomsgrad</Table.HeaderCell>
                                <Table.HeaderCell>Arbeidsgrad</Table.HeaderCell>
                                <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                                <Table.HeaderCell>Kilde</Table.HeaderCell>
                                <Table.HeaderCell>Endret dato og tidspunkt</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {[...endringer]
                                .sort((a, b) => sortTimestampDesc(a.tidspunkt, b.tidspunkt))
                                .map(({ tidspunkt, saksbehandlerIdent, dag }, i) => (
                                    <Table.Row key={i}>
                                        <Table.DataCell>{getFormattedDateString(dag.dato)}</Table.DataCell>
                                        <Table.DataCell>
                                            <FraTil
                                                fra={
                                                    dag.fraAndreYtelserGrader && ytelsestekst(dag.fraAndreYtelserGrader)
                                                }
                                                til={ytelsestekst(dag.andreYtelserGrader)}
                                            />
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <FraTil fra={prosent(dag.fraSykdomsgrad)} til={`${dag.sykdomsgrad} %`} />
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <FraTil fra={prosent(dag.fraArbeidsgrad)} til={`${dag.arbeidsgrad} %`} />
                                        </Table.DataCell>
                                        <Table.DataCell className="max-w-100 whitespace-normal!">
                                            {dag.begrunnelse}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <span data-sensitive>{saksbehandlerIdent}</span>
                                        </Table.DataCell>
                                        <Table.DataCell>{getFormattedDatetimeString(tidspunkt)}</Table.DataCell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}

function FraTil({ fra, til }: { fra?: string | null; til: string }) {
    return (
        <>
            {fra && fra !== til && <span className="line-through">{fra}</span>} {til}
        </>
    );
}

function ytelsestekst(andreYtelserGrader: Record<string, number>): string {
    const ytelser = Object.entries(andreYtelserGrader);
    if (ytelser.length === 0) return 'Ingen';
    return ytelser.map(([ytelse, grad]) => `${visningstekstForGradertAnnenYtelse(ytelse)} ${grad} %`).join(', ');
}

function prosent(grad?: number | null): string | null {
    return typeof grad === 'number' ? `${grad} %` : null;
}
