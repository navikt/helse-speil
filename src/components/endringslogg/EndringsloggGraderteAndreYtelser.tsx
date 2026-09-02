import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table } from '@navikt/ds-react';

import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserEndretEvent,
    ApiGraderteAndreYtelserEvent,
    ApiGraderteAndreYtelserEventApiGradertAnnenYtelse,
    ApiGraderteAndreYtelserGjenopprettetEvent,
    ApiGraderteAndreYtelserOpprettetEvent,
    ApiGraderteAndreYtelserPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { andreYtelserTypeTilNavn } from '@saksbilde/andreYtelser/andreYtelserLabels';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

type EndringsloggGraderteAndreYtelserProps = {
    onOpenChange: (open: boolean) => void;
    ytelse: ApiGraderteAndreYtelser;
};

export function EndringsloggGraderteAndreYtelser({
    ytelse,
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
                                <Table.HeaderCell>Dato og tidspunkt</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Ytelse</Table.HeaderCell>
                                <Table.HeaderCell>Perioder</Table.HeaderCell>
                                <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {ytelse.events
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

function EventCeller({ event }: { event: ApiGraderteAndreYtelserEvent }): ReactElement {
    switch (event.type) {
        case 'ApiGraderteAndreYtelserOpprettetEvent':
            return (
                <>
                    <Table.DataCell>Lagt til</Table.DataCell>
                    <OpprettetEventCeller event={event} />
                </>
            );
        case 'ApiGraderteAndreYtelserEndretEvent':
            return (
                <>
                    <Table.DataCell>Endret</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
        case 'ApiGraderteAndreYtelserFjernetEvent':
            return (
                <>
                    <Table.DataCell>Fjernet</Table.DataCell>
                    <FjernetEventCeller />
                </>
            );
        case 'ApiGraderteAndreYtelserGjenopprettetEvent':
            return (
                <>
                    <Table.DataCell>Gjenopprettet</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
    }
}

function OpprettetEventCeller({ event }: { event: ApiGraderteAndreYtelserOpprettetEvent }): ReactElement {
    return (
        <>
            <Table.DataCell>{andreYtelserTypeTilNavn[event.andreYtelserType]}</Table.DataCell>
            <Table.DataCell>
                {event.perioder.map((periode) => (
                    <BodyShort key={periodeNokkel(periode)}>{somPeriodetekst(periode)}</BodyShort>
                ))}
            </Table.DataCell>
        </>
    );
}

function EndretEllerGjenopprettetEventCeller({
    event,
}: {
    event: ApiGraderteAndreYtelserEndretEvent | ApiGraderteAndreYtelserGjenopprettetEvent;
}): ReactElement {
    return (
        <>
            <Table.DataCell>
                {event.endringer.andreYtelserType && (
                    <>
                        <BodyShort className="line-through">
                            {andreYtelserTypeTilNavn[event.endringer.andreYtelserType.fra]}
                        </BodyShort>
                        <BodyShort>{andreYtelserTypeTilNavn[event.endringer.andreYtelserType.til]}</BodyShort>
                    </>
                )}
            </Table.DataCell>
            <Table.DataCell>
                {event.endringer.perioder && (
                    <>
                        {event.endringer.perioder.fra.map((periode) => (
                            <BodyShort key={endringPeriodeNokkel(periode)} className="line-through">
                                {somEndringPeriodetekst(periode)}
                            </BodyShort>
                        ))}
                        {event.endringer.perioder.til.map((periode) => (
                            <BodyShort key={endringPeriodeNokkel(periode)}>{somEndringPeriodetekst(periode)}</BodyShort>
                        ))}
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
        </>
    );
}

const periodeNokkel = (periode: ApiGraderteAndreYtelserPeriode): string =>
    `${periode.fom}-${periode.tom}-${periode.grad}`;

const somPeriodetekst = (periode: ApiGraderteAndreYtelserPeriode): string =>
    `${somNorskDato(periode.fom)} - ${somNorskDato(periode.tom)}, ${periode.grad} %`;

const endringPeriodeNokkel = (periode: ApiGraderteAndreYtelserEventApiGradertAnnenYtelse): string =>
    `${periode.periode.fom}-${periode.periode.tom}-${periode.grad}`;

const somEndringPeriodetekst = (periode: ApiGraderteAndreYtelserEventApiGradertAnnenYtelse): string =>
    `${somNorskDato(periode.periode.fom)} - ${somNorskDato(periode.periode.tom)}, ${periode.grad} %`;
