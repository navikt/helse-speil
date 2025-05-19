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
    <Box
        borderWidth="0 0 0 2"
        borderColor="border-default"
        paddingBlock="2 0"
        marginBlock="0 6"
        width="max-content"
        overflow="auto"
    >
        <BodyShort weight="semibold" className={styles.tabellTittel} spacing>
            Dagoversikt
        </BodyShort>
        <Table size="small" className={styles.tabell}>
            <Table.Header className={styles.tabellHeader}>
                <Table.Row>
                    <Table.HeaderCell className={styles.datoKolonne}>Dato</Table.HeaderCell>
                    {arbeidsgiverrad.map((arbeidsgiver) => (
                        <Table.HeaderCell key={arbeidsgiver}>
                            <AnonymizableTextWithEllipsis className={styles.arbeidsgiverNavn}>
                                {capitalizeArbeidsgiver(arbeidsgiver)}
                            </AnonymizableTextWithEllipsis>
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body className={styles.tabelBody}>
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
                                    <HStack gap="1" align="center" paddingInline="1 0" wrap={false}>
                                        <div className={styles.icon}>{getTypeIcon(arbeidsgiver.dagtype, helg)}</div>
                                        <BodyShort style={{ whiteSpace: 'nowrap' }}>
                                            {dekorerTekst(arbeidsgiver.dagtype, helg)}
                                        </BodyShort>
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
