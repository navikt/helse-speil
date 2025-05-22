import cn from 'classnames';
import React from 'react';

import { BodyShort, Box, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment } from '@io/graphql';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import { dekorerTekst, getTypeIcon, tilDagtypeTabell } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DatePeriod, DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

interface Props {
    arbeidsgivere: ArbeidsgiverFragment[];
    periode: DatePeriod;
    ekskluderteUkedager: DateString[];
}

export const TilkommenInntektDagoversikt = ({ arbeidsgivere, periode, ekskluderteUkedager }: Props) => {
    const { kolonneDefinisjoner, rader } = tilDagtypeTabell(periode, arbeidsgivere);

    return (
        <Box
            borderWidth="1 1 1 1"
            borderColor="border-strong"
            width="max-content"
            height="max-content"
            minWidth="300px"
        >
            <Box background="surface-subtle" borderWidth="0 0 1 0" borderColor="border-strong">
                <HStack align="center" padding="2">
                    <BodyShort weight="semibold">Dagoversikt</BodyShort>
                </HStack>
            </Box>
            <Table size="small" className={cn(styles.tabell, styles.visning)}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        {kolonneDefinisjoner.map((arbeidsgiver) => (
                            <Table.HeaderCell key={arbeidsgiver.organisasjonsnummer}>
                                <AnonymizableTextWithEllipsis weight="semibold">
                                    {capitalizeArbeidsgiver(arbeidsgiver.navn)}
                                </AnonymizableTextWithEllipsis>
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rader.map(({ dato, dagtypePerOrganisasjonsnummer }) => {
                        const helg = erHelg(dato);
                        const valgt = ekskluderteUkedager.includes(dato);
                        return (
                            <Table.Row
                                key={dato + 'row'}
                                className={cn(helg && styles.helg, valgt && styles.valgteDatoer)}
                            >
                                <Table.DataCell>
                                    <span id={`id-${dato}`}>{somNorskDato(dato)}</span>
                                </Table.DataCell>
                                {kolonneDefinisjoner.map((arbeidsgiver) => {
                                    const dagtype = dagtypePerOrganisasjonsnummer.get(arbeidsgiver.organisasjonsnummer);
                                    return (
                                        <Table.DataCell key={dato + arbeidsgiver.organisasjonsnummer}>
                                            <HStack gap="2" wrap={false}>
                                                {dagtype && (
                                                    <>
                                                        <div className={styles.icon}>{getTypeIcon(dagtype, helg)}</div>
                                                        <BodyShort>{dekorerTekst(dagtype, helg)}</BodyShort>
                                                    </>
                                                )}
                                            </HStack>
                                        </Table.DataCell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
};
