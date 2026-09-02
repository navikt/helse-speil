import React, { ReactElement } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import {
    ApiGraderteAndreYtelserEndretEvent,
    ApiGraderteAndreYtelserEvent,
    ApiGraderteAndreYtelserEventApiGradertAnnenYtelse,
    ApiGraderteAndreYtelserFjernetEvent,
    ApiGraderteAndreYtelserGjenopprettetEvent,
    ApiGraderteAndreYtelserOpprettetEvent,
    ApiGraderteAndreYtelserPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { andreYtelserTypeTilNavn } from '@saksbilde/andreYtelser/andreYtelserLabels';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { somNorskDato } from '@utils/date';

export function AndreYtelserHendelse({ event }: { event: ApiGraderteAndreYtelserEvent }): ReactElement {
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
}

export function AndreYtelserOpprettetHendelse({
    event,
}: {
    event: ApiGraderteAndreYtelserOpprettetEvent;
}): ReactElement {
    return (
        <>
            <VStack>
                <BodyShort weight="semibold">Ytelse</BodyShort>
                <BodyShort>{andreYtelserTypeTilNavn[event.andreYtelserType]}</BodyShort>
            </VStack>
            <VStack>
                <BodyShort weight="semibold">Periode f.o.m. - t.o.m., grad</BodyShort>
                {event.perioder.map((periode) => (
                    <BodyShort key={`${periode.fom}-${periode.tom}-${periode.grad}`}>{periodetekst(periode)}</BodyShort>
                ))}
            </VStack>
            <VStack>
                <BodyShort weight="semibold">Notat til beslutter</BodyShort>
                <BodyShortWithPreWrap>{event.metadata.notatTilBeslutter}</BodyShortWithPreWrap>
            </VStack>
        </>
    );
}

export function AndreYtelserEndretEllerGjenopprettetHendelse({
    event,
}: {
    event: ApiGraderteAndreYtelserEndretEvent | ApiGraderteAndreYtelserGjenopprettetEvent;
}): ReactElement {
    return (
        <>
            {event.endringer.andreYtelserType && (
                <VStack>
                    <BodyShort weight="semibold">Ytelse</BodyShort>
                    <BodyShort className="line-through" textColor="subtle">
                        {andreYtelserTypeTilNavn[event.endringer.andreYtelserType.fra]}
                    </BodyShort>
                    <BodyShort>{andreYtelserTypeTilNavn[event.endringer.andreYtelserType.til]}</BodyShort>
                </VStack>
            )}
            {event.endringer.perioder && (
                <VStack>
                    <BodyShort weight="semibold">Periode f.o.m. - t.o.m., grad</BodyShort>
                    {event.endringer.perioder.fra.map((periode) => (
                        <BodyShort
                            key={`fra-${periode.periode.fom}-${periode.periode.tom}-${periode.grad}`}
                            className="line-through"
                            textColor="subtle"
                        >
                            {gradertPeriodetekst(periode)}
                        </BodyShort>
                    ))}
                    {event.endringer.perioder.til.map((periode) => (
                        <BodyShort key={`til-${periode.periode.fom}-${periode.periode.tom}-${periode.grad}`}>
                            {gradertPeriodetekst(periode)}
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
}

export function AndreYtelserFjernetHendelse({ event }: { event: ApiGraderteAndreYtelserFjernetEvent }): ReactElement {
    return (
        <VStack>
            <BodyShort weight="semibold">Begrunn hvorfor ytelsen fjernes</BodyShort>
            <BodyShortWithPreWrap>{event.metadata.notatTilBeslutter}</BodyShortWithPreWrap>
        </VStack>
    );
}

function tittel(event: ApiGraderteAndreYtelserEvent): string {
    switch (event.type) {
        case 'ApiGraderteAndreYtelserOpprettetEvent':
            return 'Andre ytelser lagt til';
        case 'ApiGraderteAndreYtelserEndretEvent':
            return 'Andre ytelser endret';
        case 'ApiGraderteAndreYtelserFjernetEvent':
            return 'Andre ytelser fjernet';
        case 'ApiGraderteAndreYtelserGjenopprettetEvent':
            return 'Andre ytelser gjenopprettet';
    }
}

function komponent(event: ApiGraderteAndreYtelserEvent): ReactElement {
    switch (event.type) {
        case 'ApiGraderteAndreYtelserOpprettetEvent':
            return <AndreYtelserOpprettetHendelse event={event} />;
        case 'ApiGraderteAndreYtelserEndretEvent':
        case 'ApiGraderteAndreYtelserGjenopprettetEvent':
            return <AndreYtelserEndretEllerGjenopprettetHendelse event={event} />;
        case 'ApiGraderteAndreYtelserFjernetEvent':
            return <AndreYtelserFjernetHendelse event={event} />;
    }
}

function periodetekst(periode: ApiGraderteAndreYtelserPeriode): string {
    return `${somNorskDato(periode.fom)} - ${somNorskDato(periode.tom)}, ${periode.grad} %`;
}

function gradertPeriodetekst(periode: ApiGraderteAndreYtelserEventApiGradertAnnenYtelse): string {
    return `${somNorskDato(periode.periode.fom)} - ${somNorskDato(periode.periode.tom)}, ${periode.grad} %`;
}
