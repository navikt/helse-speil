import cn from 'classnames';
import React from 'react';

import { BodyShort, Box, HStack, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import { TabellArbeidsdag, dekorerTekst, getTypeIcon } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { erHelg, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

interface Props {
    arbeidsgiverrad: string[];
    ekskluderteUkedager: string[];
    arbeidsgiverdager: TabellArbeidsdag[];
}

export const TilkommenInntektDagoversikt = ({ arbeidsgiverrad, ekskluderteUkedager, arbeidsgiverdager }: Props) => (
    <Box borderWidth="1 1 1 1" borderColor="border-strong" width="max-content" height="max-content" minWidth="300px">
        <Box background="surface-subtle" borderWidth="0 0 1 0" borderColor="border-strong">
            <HStack align="center" padding="2">
                <BodyShort weight="semibold">Dagoversikt</BodyShort>
            </HStack>
        </Box>
        <Table size="small" className={cn(styles.tabell, styles.visning)}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Dato</Table.HeaderCell>
                    {arbeidsgiverrad.map((arbeidsgiver) => (
                        <Table.HeaderCell key={arbeidsgiver}>
                            <AnonymizableTextWithEllipsis weight="semibold">
                                {capitalizeArbeidsgiver(arbeidsgiver)}
                            </AnonymizableTextWithEllipsis>
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {arbeidsgiverdager.map((dag) => {
                    const helg = erHelg(dag.dato);
                    const valgt = ekskluderteUkedager.includes(dag.dato);
                    return (
                        <Table.Row
                            key={dag.dato + 'row'}
                            className={cn(helg && styles.helg, valgt && styles.valgteDatoer)}
                        >
                            <Table.DataCell>
                                <span id={`id-${dag.dato}`}>{somNorskDato(dag.dato)}</span>
                            </Table.DataCell>
                            {dag.arbeidsgivere.map((arbeidsgiver) => (
                                <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                    <HStack gap="2" wrap={false}>
                                        <div className={styles.icon}>{getTypeIcon(arbeidsgiver.dagtype, helg)}</div>
                                        <BodyShort>{dekorerTekst(arbeidsgiver.dagtype, helg)}</BodyShort>
                                    </HStack>
                                </Table.DataCell>
                            ))}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    </Box>
);
