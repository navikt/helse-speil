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

interface TilkommenInntektHendelseProps {
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent;
}

interface TilkommenInntektOpprettetHendelseProps {
    event: TilkommenInntektOpprettetEvent;
}

export const TilkommenInntektOpprettetHendelse = ({ event }: TilkommenInntektOpprettetHendelseProps) => {
    return (
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
};

interface TilkommenInntektEndretHendelseProps {
    event: TilkommenInntektEndretEvent | TilkommenInntektGjenopprettetEvent;
}

export const TilkommenInntektEndretHendelse = ({ event }: TilkommenInntektEndretHendelseProps) => {
    return (
        <>
            {event.endringer.organisasjonsnummer && (
                <VStack>
                    <BodyShort weight="semibold">Organisasjonsnummer</BodyShort>
                    <AnonymizableTextWithEllipsis className={styles.linethrough}>
                        {event.endringer.organisasjonsnummer.fra}
                    </AnonymizableTextWithEllipsis>
                    <AnonymizableTextWithEllipsis>
                        {event.endringer.organisasjonsnummer.til}
                    </AnonymizableTextWithEllipsis>
                </VStack>
            )}
            {event.endringer.periode && (
                <VStack>
                    <BodyShort weight="semibold">Periode f.o.m. - t.o.m.</BodyShort>
                    <BodyShort className={styles.linethrough}>
                        {somNorskDato(event.endringer.periode.fra.fom)} -{' '}
                        {somNorskDato(event.endringer.periode.fra.tom)}
                    </BodyShort>
                    <BodyShort>
                        {somNorskDato(event.endringer.periode.til.fom)} -{' '}
                        {somNorskDato(event.endringer.periode.til.tom)}
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
                    {event.endringer.ekskluderteUkedager.fra.map((dag) => (
                        <BodyShort key={dag} className={styles.linethrough}>
                            {somNorskDato(dag)}
                        </BodyShort>
                    ))}
                    {event.endringer.ekskluderteUkedager.til.map((dag) => (
                        <BodyShort key={dag}>{somNorskDato(dag)}</BodyShort>
                    ))}
                </VStack>
            )}
            <VStack>
                <BodyShort weight="semibold">Notat til beslutter</BodyShort>
                <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
            </VStack>
        </>
    );
};

interface TilkommenInntektFjernetHendelseProps {
    event: TilkommenInntektFjernetEvent;
}

export const TilkommenInntektFjernetHendelse = ({ event }: TilkommenInntektFjernetHendelseProps) => {
    return (
        <VStack>
            <BodyShort weight="semibold">Begrunn hvorfor perioden fjernes</BodyShort>
            <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
        </VStack>
    );
};

function tittel(
    event:
        | TilkommenInntektOpprettetEvent
        | TilkommenInntektEndretEvent
        | TilkommenInntektFjernetEvent
        | TilkommenInntektGjenopprettetEvent,
) {
    switch (event.__typename) {
        case 'TilkommenInntektOpprettetEvent':
            return 'Tilkommen inntekt lagt til';
        case 'TilkommenInntektEndretEvent':
            return 'Tilk. inntekt endret';
        case 'TilkommenInntektFjernetEvent':
            return 'Periode for tilkommen inntekt fjernet';
        case 'TilkommenInntektGjenopprettetEvent':
            return 'Tilkommen inntekt gjenopprettet';
    }
}

function foreløpigNavn(
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
            return <TilkommenInntektEndretHendelse event={event} />;
        case 'TilkommenInntektFjernetEvent':
            return <TilkommenInntektFjernetHendelse event={event} />;
    }
}

export const TilkommenInntektHendelse = ({ event }: TilkommenInntektHendelseProps) => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={tittel(event)}
            timestamp={event.metadata.tidspunkt}
            saksbehandler={event.metadata.utfortAvSaksbehandlerIdent}
            aktiv={false}
        >
            {foreløpigNavn(event)}
        </Historikkhendelse>
    );
};
