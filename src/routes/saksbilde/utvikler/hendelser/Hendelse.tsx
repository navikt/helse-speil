import classNames from 'classnames';
import React, { useState } from 'react';

import { BodyShort, Box, Button, CopyButton, HStack, Loader, Table, Tooltip, VStack } from '@navikt/ds-react';

import { SparsomAktivitet } from '@io/rest/sparsom';
import { useSpleisHendelseQuery } from '@io/rest/spleis';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { getFormattedDatetimeString } from '@utils/date';

import { Hendelse as HendelseType, erLagretISpleis } from './hendelsegruppering';

interface HendelseProps {
    hendelse: HendelseType;
}

export function Hendelse({ hendelse }: HendelseProps) {
    const [åpen, setÅpen] = useState(false);
    const [visMelding, setVisMelding] = useState(false);
    const kanViseMelding = erLagretISpleis(hendelse);

    function toggleMelding() {
        if (!visMelding) setÅpen(true);
        setVisMelding(!visMelding);
    }

    const visMeldingKnapp = (
        <Button
            size="xsmall"
            variant="tertiary"
            aria-expanded={visMelding}
            disabled={!kanViseMelding}
            onClick={toggleMelding}
        >
            {visMelding ? 'Skjul melding' : 'Vis melding'}
        </Button>
    );

    return (
        <Table.ExpandableRow
            open={åpen}
            onOpenChange={setÅpen}
            expandOnRowClick
            className={classNames(
                hendelse.harVarsel && 'bg-ax-bg-warning-soft',
                hendelse.harFeil && 'bg-ax-bg-danger-soft',
            )}
            content={
                <VStack gap="space-8">
                    <VStack as="ul">
                        {hendelse.aktiviteter.map((aktivitet) => (
                            <Aktivitet key={aktivitet.id} aktivitet={aktivitet} />
                        ))}
                    </VStack>
                    {visMelding && <Melding meldingsreferanseId={hendelse.meldingsreferanseId} />}
                </VStack>
            }
        >
            <Table.DataCell textSize="small">{hendelse.type}</Table.DataCell>
            <Table.DataCell textSize="small" className="whitespace-nowrap">
                {getFormattedDatetimeString(hendelse.opprettet)}
            </Table.DataCell>
            <Table.DataCell textSize="small">
                <HStack gap="space-4" align="center" wrap={false}>
                    {hendelse.meldingsreferanseId}
                    <Tooltip content="Kopier meldingsreferanse">
                        <CopyButton size="xsmall" copyText={hendelse.meldingsreferanseId} />
                    </Tooltip>
                </HStack>
            </Table.DataCell>
            <Table.DataCell textSize="small">
                {kanViseMelding ? (
                    visMeldingKnapp
                ) : (
                    <Tooltip content={`${hendelse.type} lagres ikke i Spleis`} describesChild>
                        {visMeldingKnapp}
                    </Tooltip>
                )}
            </Table.DataCell>
        </Table.ExpandableRow>
    );
}

function Aktivitet({ aktivitet }: { aktivitet: SparsomAktivitet }) {
    return (
        <HStack
            as="li"
            gap="space-16"
            wrap={false}
            className={classNames(
                aktivitet.nivå === 'VARSEL' && 'bg-ax-bg-warning-soft',
                (aktivitet.nivå === 'FUNKSJONELL_FEIL' || aktivitet.nivå === 'LOGISK_FEIL') && 'bg-ax-bg-danger-soft',
            )}
        >
            <BodyShort size="small" className="w-36 shrink-0">
                {aktivitet.nivå}
            </BodyShort>
            <BodyShort size="small">{aktivitet.tekst}</BodyShort>
        </HStack>
    );
}

function Melding({ meldingsreferanseId }: { meldingsreferanseId: string }) {
    const { data, isPending, error } = useSpleisHendelseQuery(meldingsreferanseId);

    return (
        <Box paddingBlock="space-8">
            {isPending ? (
                <Loader size="small" title="Henter melding fra Spleis" />
            ) : error ? (
                <BodyShort>Kunne ikke hente melding fra Spleis: {error.message}</BodyShort>
            ) : (
                <JsonVisning data={data} />
            )}
        </Box>
    );
}
