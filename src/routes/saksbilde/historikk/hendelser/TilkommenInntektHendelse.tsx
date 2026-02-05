import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import {
    ApiTilkommenInntektEndretEvent,
    ApiTilkommenInntektEvent,
    ApiTilkommenInntektFjernetEvent,
    ApiTilkommenInntektGjenopprettetEvent,
    ApiTilkommenInntektOpprettetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { tilSorterteDagerMedEndringstype } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

import styles from './TilkommenInntektHendelse.module.css';

export const TilkommenInntektOpprettetHendelse = ({ event }: { event: ApiTilkommenInntektOpprettetEvent }) => (
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
            <BodyShortWithPreWrap>{event.metadata.notatTilBeslutter}</BodyShortWithPreWrap>
        </VStack>
    </>
);

export const TilkommenInntektEndretEllerGjenopprettetHendelse = ({
    event,
}: {
    event: ApiTilkommenInntektEndretEvent | ApiTilkommenInntektGjenopprettetEvent;
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
                {tilSorterteDagerMedEndringstype(event.endringer.ekskluderteUkedager).map(({ dag, endringstype }) => (
                    <BodyShort
                        key={dag}
                        className={cn(endringstype === 'fjernet' && styles.linethrough)}
                        textColor={endringstype === 'lagt til' ? 'default' : 'subtle'}
                    >
                        {somNorskDato(dag)}
                    </BodyShort>
                ))}
            </VStack>
        )}
        <VStack>
            <BodyShort weight="semibold">Notat til beslutter</BodyShort>
            <BodyShortWithPreWrap>{event.metadata.notatTilBeslutter}</BodyShortWithPreWrap>
        </VStack>
    </>
);

export const TilkommenInntektFjernetHendelse = ({ event }: { event: ApiTilkommenInntektFjernetEvent }) => (
    <VStack>
        <BodyShort weight="semibold">Begrunn hvorfor perioden fjernes</BodyShort>
        <BodyShort>{event.metadata.notatTilBeslutter}</BodyShort>
    </VStack>
);

function tittel(event: ApiTilkommenInntektEvent) {
    switch (event.type) {
        case 'ApiTilkommenInntektOpprettetEvent':
            return 'Tilk. inntekt lagt til';
        case 'ApiTilkommenInntektEndretEvent':
            return 'Tilk. inntekt endret';
        case 'ApiTilkommenInntektFjernetEvent':
            return 'Tilk. inntekt fjernet';
        case 'ApiTilkommenInntektGjenopprettetEvent':
            return 'Tilk. inntekt gjenopprettet';
    }
}

function komponent(event: ApiTilkommenInntektEvent) {
    switch (event.type) {
        case 'ApiTilkommenInntektOpprettetEvent':
            return <TilkommenInntektOpprettetHendelse event={event} />;
        case 'ApiTilkommenInntektEndretEvent':
        case 'ApiTilkommenInntektGjenopprettetEvent':
            return <TilkommenInntektEndretEllerGjenopprettetHendelse event={event} />;
        case 'ApiTilkommenInntektFjernetEvent':
            return <TilkommenInntektFjernetHendelse event={event} />;
    }
}

export const TilkommenInntektHendelse = ({ event }: { event: ApiTilkommenInntektEvent }) => {
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
