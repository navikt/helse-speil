import React, { useState } from 'react';

import { BodyShort, HStack, Loader, Switch, Table, TextField, VStack } from '@navikt/ds-react';

import { useSparsomAktiviteterQuery } from '@io/rest/sparsom';

import { Hendelse } from './Hendelse';
import { erPåminnelse, hendelserForVedtaksperiode } from './hendelsegruppering';

interface HendelserProps {
    vedtaksperiodeId: string;
    fødselsnummer: string;
}

export function Hendelser({ vedtaksperiodeId, fødselsnummer }: HendelserProps) {
    const { data, isPending, error } = useSparsomAktiviteterQuery(fødselsnummer);
    const [bareFeil, setBareFeil] = useState(false);
    const [skjulPåminnelser, setSkjulPåminnelser] = useState(true);
    const [eldsteFørst, setEldsteFørst] = useState(false);
    const [prefix, setPrefix] = useState('');

    if (isPending) return <Loader size="medium" title="Henter hendelser fra Sparsom" />;
    if (error) return <BodyShort>Kunne ikke hente hendelser fra Sparsom: {error.message}</BodyShort>;

    const hendelser = hendelserForVedtaksperiode(data.aktiviteter, vedtaksperiodeId)
        .filter((it) => !skjulPåminnelser || !erPåminnelse(it) || it.harFeil || it.harVarsel)
        .filter((it) => !bareFeil || it.harFeil || it.harVarsel)
        .filter((it) => it.type.toLowerCase().startsWith(prefix.toLowerCase()))
        .sort((a, b) => (eldsteFørst ? 1 : -1) * a.opprettet.localeCompare(b.opprettet));

    return (
        <VStack gap="space-16">
            <HStack gap="space-16" align="end">
                <Switch size="small" checked={bareFeil} onChange={() => setBareFeil(!bareFeil)}>
                    Bare feil og varsler
                </Switch>
                <Switch size="small" checked={skjulPåminnelser} onChange={() => setSkjulPåminnelser(!skjulPåminnelser)}>
                    Skjul påminnelser og utbetalingshistorikk
                </Switch>
                <Switch size="small" checked={eldsteFørst} onChange={() => setEldsteFørst(!eldsteFørst)}>
                    Eldste først
                </Switch>
                <TextField
                    size="small"
                    label="Hendelsetype starter med"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                />
            </HStack>
            {hendelser.length === 0 ? (
                <BodyShort>Fant ingen hendelser for vedtaksperioden</BodyShort>
            ) : (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell textSize="small">Hendelsetype</Table.HeaderCell>
                            <Table.HeaderCell textSize="small">Opprettet</Table.HeaderCell>
                            <Table.HeaderCell textSize="small">Meldingsreferanse</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {hendelser.map((hendelse) => (
                            <Hendelse key={hendelse.meldingsreferanseId} hendelse={hendelse} />
                        ))}
                    </Table.Body>
                </Table>
            )}
        </VStack>
    );
}
