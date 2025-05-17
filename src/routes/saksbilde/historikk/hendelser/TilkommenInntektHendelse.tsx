import cn from 'classnames';
import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import {
    TilkommenInntektEndretEvent,
    TilkommenInntektFjernetEvent,
    TilkommenInntektGjenopprettetEvent,
    TilkommenInntektOpprettetEvent,
} from '@io/graphql';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './TilkommenInntektHendelse.module.css';

export const TilkommenInntektOpprettetHendelse = ({ event }: { event: TilkommenInntektOpprettetEvent }) => (
    <>
        <VStack>
            <BodyShort weight="semibold">Organisasjonsnummer</BodyShort>
            <AnonymizableTextWithEllipsis>{event.organisasjonsnummer}</AnonymizableTextWithEllipsis>
        </VStack>
        <VStack>
            <BodyShort weight="semibold">Periode f.o.m. - t.o.m.</BodyShort>
            <BodyShort>
                {somNorskDato(event.periode.fom)} - {somNorskDato(event.periode.tom)}
            </BodyShort>
        </VStack>
        <VStack>
            <BodyShort weight="semibold">Inntekt for perioden</BodyShort>
            <BodyShort>{somPenger(Number(event.periodebelop))}</BodyShort>
        </VStack>
        <VStack>
            <BodyShort weight="semibold">Dager som ikke skal graderes</BodyShort>
            {event.ekskluderteUkedager.map((dag) => (
                <BodyShort key={dag}>{somNorskDato(dag)}</BodyShort>
            ))}
        </VStack>
        <VStack>
            <BodyShort weight="semibold">Notat til beslutter</BodyShort>
            <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
        </VStack>
    </>
);

export const TilkommenInntektEndretEllerGjenopprettetHendelse = ({
    event,
}: {
    event: TilkommenInntektEndretEvent | TilkommenInntektGjenopprettetEvent;
}) => (
    <>
        {event.endringer.organisasjonsnummer && (
            <VStack>
                <BodyShort weight="semibold">Organisasjonsnummer</BodyShort>
                <AnonymizableTextWithEllipsis className={styles.linethrough}>
                    {event.endringer.organisasjonsnummer.fra}
                </AnonymizableTextWithEllipsis>
                <AnonymizableTextWithEllipsis>{event.endringer.organisasjonsnummer.til}</AnonymizableTextWithEllipsis>
            </VStack>
        )}
        {event.endringer.periode && (
            <VStack>
                <BodyShort weight="semibold">Periode f.o.m. - t.o.m.</BodyShort>
                <BodyShort className={styles.linethrough}>
                    {somNorskDato(event.endringer.periode.fra.fom)} - {somNorskDato(event.endringer.periode.fra.tom)}
                </BodyShort>
                <BodyShort>
                    {somNorskDato(event.endringer.periode.til.fom)} - {somNorskDato(event.endringer.periode.til.tom)}
                </BodyShort>
            </VStack>
        )}
        {event.endringer.periodebelop && (
            <VStack>
                <BodyShort weight="semibold">Inntekt for perioden</BodyShort>
                <BodyShort className={styles.linethrough}>
                    {somPenger(Number(event.endringer.periodebelop.fra))}
                </BodyShort>
                <BodyShort>{somPenger(Number(event.endringer.periodebelop.til))}</BodyShort>
            </VStack>
        )}
        {event.endringer.ekskluderteUkedager && (
            <VStack>
                <BodyShort weight="semibold">Dager som ikke skal graderes</BodyShort>
                {event.endringer.ekskluderteUkedager.fra
                    .filter((dag) => !event.endringer.ekskluderteUkedager!.til.includes(dag))
                    .map((dag) => ({ dag: dag, handling: 'fjernet' }))
                    .concat(
                        event.endringer.ekskluderteUkedager.fra
                            .filter((dag) => event.endringer.ekskluderteUkedager!.til.includes(dag))
                            .map((dag) => ({ dag: dag, handling: 'beholdt' })),
                    )
                    .concat(
                        event.endringer.ekskluderteUkedager.til
                            .filter((dag) => !event.endringer.ekskluderteUkedager!.fra.includes(dag))
                            .map((dag) => ({ dag: dag, handling: 'lagt til' })),
                    )
                    .sort((a, b) => a.dag.localeCompare(b.dag))
                    .map(({ dag, handling }) => (
                        <BodyShort
                            key={dag}
                            className={cn(handling === 'fjernet' && styles.linethrough)}
                            textColor={handling === 'lagt til' ? 'default' : 'subtle'}
                        >
                            {somNorskDato(dag)}
                        </BodyShort>
                    ))}
            </VStack>
        )}
        <VStack>
            <BodyShort weight="semibold">Notat til beslutter</BodyShort>
            <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
        </VStack>
    </>
);

export const TilkommenInntektFjernetHendelse = ({ event }: { event: TilkommenInntektFjernetEvent }) => (
    <VStack>
        <BodyShort weight="semibold">Begrunn hvorfor perioden fjernes</BodyShort>
        <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
    </VStack>
);

function tittel(
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent,
) {
    switch (event.__typename) {
        case 'TilkommenInntektOpprettetEvent':
            return 'Tilk. inntekt lagt til';
        case 'TilkommenInntektEndretEvent':
            return 'Tilk. inntekt endret';
        case 'TilkommenInntektFjernetEvent':
            return 'Tilk. inntekt fjernet';
        case 'TilkommenInntektGjenopprettetEvent':
            return 'Tilk. inntekt gjenopprettet';
    }
}

function komponent(
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent,
) {
    switch (event.__typename) {
        case 'TilkommenInntektOpprettetEvent':
            return <TilkommenInntektOpprettetHendelse event={event} />;
        case 'TilkommenInntektEndretEvent':
        case 'TilkommenInntektGjenopprettetEvent':
            return <TilkommenInntektEndretEllerGjenopprettetHendelse event={event} />;
        case 'TilkommenInntektFjernetEvent':
            return <TilkommenInntektFjernetHendelse event={event} />;
    }
}

export const TilkommenInntektHendelse = ({
    event,
}: {
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent;
}) => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={tittel(event)}
            timestamp={event.metadata.tidspunkt}
            saksbehandler={event.metadata.utfortAvSaksbehandlerIdent}
            aktiv={false}
        >
            {komponent(event)}
        </Historikkhendelse>
    );
};
