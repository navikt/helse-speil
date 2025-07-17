import cn from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import {
    TilkommenInntekt,
    TilkommenInntektEndretEvent,
    TilkommenInntektFjernetEvent,
    TilkommenInntektGjenopprettetEvent,
    TilkommenInntektOpprettetEvent,
} from '@io/graphql';
import { tilSorterteDagerMedEndringstype } from '@state/tilkommenInntekt';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Endringslogg.module.css';

type EndringsloggTilkommenInntektProps = {
    closeModal: () => void;
    showModal: boolean;
    tilkommenInntekt: TilkommenInntekt;
};

export const EndringsloggTilkommenInntekt = ({
    tilkommenInntekt,
    closeModal,
    showModal,
}: EndringsloggTilkommenInntektProps): ReactElement => (
    <Modal
        aria-label="Endringslogg modal"
        width="1200px"
        portal
        closeOnBackdropClick
        open={showModal}
        onClose={closeModal}
    >
        <Modal.Header>
            <Heading level="1" size="medium">
                Endringslogg
            </Heading>
        </Modal.Header>
        <Modal.Body>
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
                        .map(
                            (event) =>
                                event as
                                    | TilkommenInntektOpprettetEvent
                                    | TilkommenInntektEndretEvent
                                    | TilkommenInntektFjernetEvent
                                    | TilkommenInntektGjenopprettetEvent,
                        )
                        .map((event, i) => (
                            <Table.Row key={i}>
                                <Table.DataCell>{getFormattedDatetimeString(event.metadata.tidspunkt)}</Table.DataCell>
                                <EventCeller event={event} />
                                <Table.DataCell>{event.metadata.utfortAvSaksbehandlerIdent}</Table.DataCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Modal.Body>
    </Modal>
);

const EventCeller = ({
    event,
}: {
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent;
}): ReactElement => {
    switch (event.__typename) {
        case 'TilkommenInntektOpprettetEvent':
            return (
                <>
                    <Table.DataCell>Lagt til</Table.DataCell>
                    <OpprettetEventCeller event={event} />
                </>
            );
        case 'TilkommenInntektEndretEvent':
            return (
                <>
                    <Table.DataCell>Endret</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
        case 'TilkommenInntektFjernetEvent':
            return (
                <>
                    <Table.DataCell>Fjernet</Table.DataCell>
                    <FjernetEventCeller />
                </>
            );
        case 'TilkommenInntektGjenopprettetEvent':
            return (
                <>
                    <Table.DataCell>Gjenopprettet</Table.DataCell>
                    <EndretEllerGjenopprettetEventCeller event={event} />
                </>
            );
    }
};

const OpprettetEventCeller = ({ event }: { event: TilkommenInntektOpprettetEvent }): ReactElement => (
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

const EndretEllerGjenopprettetEventCeller = ({
    event,
}: {
    event: TilkommenInntektEndretEvent | TilkommenInntektGjenopprettetEvent;
}): ReactElement => (
    <>
        <Table.DataCell>
            {event.endringer.organisasjonsnummer && (
                <>
                    <AnonymizableTextWithEllipsis className={styles.PreviousValue}>
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
                    <BodyShort className={styles.PreviousValue}>
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
                    <BodyShort className={styles.PreviousValue}>
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
                                className={cn(endringstype === 'fjernet' && styles.PreviousValue)}
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

const FjernetEventCeller = (): ReactElement => (
    <>
        <Table.DataCell></Table.DataCell>
        <Table.DataCell></Table.DataCell>
        <Table.DataCell></Table.DataCell>
        <Table.DataCell></Table.DataCell>
    </>
);
