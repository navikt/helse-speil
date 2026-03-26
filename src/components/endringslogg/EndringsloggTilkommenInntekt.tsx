import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import {
    ApiTilkommenInntekt,
    ApiTilkommenInntektEndretEvent,
    ApiTilkommenInntektEvent,
    ApiTilkommenInntektGjenopprettetEvent,
    ApiTilkommenInntektOpprettetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { tilSorterteDagerMedEndringstype } from '@state/tilkommenInntekt';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

type EndringsloggTilkommenInntektProps = {
    onOpenChange: (open: boolean) => void;
    tilkommenInntekt: ApiTilkommenInntekt;
};

export function EndringsloggTilkommenInntekt({
    tilkommenInntekt,
    onOpenChange,
}: EndringsloggTilkommenInntektProps): ReactElement {
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
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Organisasjonsnummer</Table.HeaderCell>
                                <Table.HeaderCell>Periode f.o.m. - t.o.m.</Table.HeaderCell>
                                <Table.HeaderCell>Inntekt for perioden</Table.HeaderCell>
                                <Table.HeaderCell>Dager som ikke skal graderes</Table.HeaderCell>
                                <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tilkommenInntekt.events
                                .toSorted((a, b) => b.metadata.sekvensnummer - a.metadata.sekvensnummer)
                                .map((event, i) => (
                                    <Table.Row key={i}>
                                        <Table.DataCell>
                                            {getFormattedDatetimeString(event.metadata.tidspunkt)}
                                        </Table.DataCell>
                                        <EventCeller event={event} />
                                        <Table.DataCell>{event.metadata.utfortAvSaksbehandlerIdent}</Table.DataCell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}

function EventCeller({ event }: { event: ApiTilkommenInntektEvent }): ReactElement {
    switch (event.type) {
        case 'ApiTilkommenInntektOpprettetEvent':
            return (
                <>
                    <Table.DataCell>Lagt til</Table.DataCell>
                    <OpprettetEventCeller event={event} />
                </>
            );
        case 'ApiTilkommenInntektEndretEvent':
            return (
                <>
                    <Table.DataCell>Endret</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
        case 'ApiTilkommenInntektFjernetEvent':
            return (
                <>
                    <Table.DataCell>Fjernet</Table.DataCell>
                    <FjernetEventCeller />
                </>
            );
        case 'ApiTilkommenInntektGjenopprettetEvent':
            return (
                <>
                    <Table.DataCell>Gjenopprettet</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
    }
}

function OpprettetEventCeller({ event }: { event: ApiTilkommenInntektOpprettetEvent }): ReactElement {
    return (
        <>
            <Table.DataCell>
                <AnonymizableTextWithEllipsis>{event.organisasjonsnummer}</AnonymizableTextWithEllipsis>
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort>
                    {somNorskDato(event.periode.fom)} - {somNorskDato(event.periode.tom)}
                </BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort>{somPenger(Number(event.periodebelop))}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                {event.ekskluderteUkedager.map((dag) => (
                    <BodyShort key={dag}>{somNorskDato(dag)}</BodyShort>
                ))}
            </Table.DataCell>
        </>
    );
}

function EndretEllerGjenopprettetEventCeller({
    event,
}: {
    event: ApiTilkommenInntektEndretEvent | ApiTilkommenInntektGjenopprettetEvent;
}): ReactElement {
    return (
        <>
            <Table.DataCell>
                {event.endringer.organisasjonsnummer && (
                    <>
                        <AnonymizableTextWithEllipsis className="line-through">
                            {event.endringer.organisasjonsnummer.fra}
                        </AnonymizableTextWithEllipsis>
                        <AnonymizableTextWithEllipsis>
                            {event.endringer.organisasjonsnummer.til}
                        </AnonymizableTextWithEllipsis>
                    </>
                )}
            </Table.DataCell>
            <Table.DataCell>
                {event.endringer.periode && (
                    <>
                        <BodyShort className="line-through">
                            {somNorskDato(event.endringer.periode.fra.fom)} -{' '}
                            {somNorskDato(event.endringer.periode.fra.tom)}
                        </BodyShort>
                        <BodyShort>
                            {somNorskDato(event.endringer.periode.til.fom)} -{' '}
                            {somNorskDato(event.endringer.periode.til.tom)}
                        </BodyShort>
                    </>
                )}
            </Table.DataCell>
            <Table.DataCell>
                {event.endringer.periodebelop && (
                    <>
                        <BodyShort className="line-through">
                            {somPenger(Number(event.endringer.periodebelop.fra))}
                        </BodyShort>
                        <BodyShort>{somPenger(Number(event.endringer.periodebelop.til))}</BodyShort>
                    </>
                )}
            </Table.DataCell>
            <Table.DataCell>
                {event.endringer.ekskluderteUkedager && (
                    <>
                        {tilSorterteDagerMedEndringstype(event.endringer.ekskluderteUkedager).map(
                            ({ dag, endringstype }) => (
                                <BodyShort
                                    key={dag}
                                    className={cn(endringstype === 'fjernet' && 'line-through')}
                                    textColor={endringstype === 'lagt til' ? 'default' : 'subtle'}
                                >
                                    {somNorskDato(dag)}
                                </BodyShort>
                            ),
                        )}
                    </>
                )}
            </Table.DataCell>
        </>
    );
}

function FjernetEventCeller(): ReactElement {
    return (
        <>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
            <Table.DataCell></Table.DataCell>
        </>
    );
}
