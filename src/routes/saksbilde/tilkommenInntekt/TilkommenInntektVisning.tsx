import cn from 'classnames';
import React, { ReactElement } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack, Table, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { Maybe } from '@/io/graphql';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import { dekorerTekst, getTypeIcon, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { erHelg, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver, somPenger } from '@utils/locale';

interface TilkommenInntektVisningProps {
    tilkommenInntektId: string;
}

export const TilkommenInntektVisning = ({ tilkommenInntektId }: TilkommenInntektVisningProps): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person?.fodselsnummer);
    const tilkommenInntektMedOrganisasjonsnummer = tilkommenInntektData?.tilkomneInntektskilderV2
        ?.flatMap((tilkommenInntektskilde) =>
            tilkommenInntektskilde.inntekter.map((tilkommenInntekt) => ({
                organisasjonsnummer: tilkommenInntektskilde.organisasjonsnummer,
                tilkommenInntekt: tilkommenInntekt,
            })),
        )
        .find(
            (inntektMedOrganisasjonsnummer) =>
                inntektMedOrganisasjonsnummer.tilkommenInntekt.tilkommenInntektId === tilkommenInntektId,
        );

    const organisasjonsnummer = tilkommenInntektMedOrganisasjonsnummer?.organisasjonsnummer;
    const tilkommenInntekt = tilkommenInntektMedOrganisasjonsnummer?.tilkommenInntekt;
    const { data: orgData } = useOrganisasjonQuery(organisasjonsnummer);

    if (!tilkommenInntekt || !organisasjonsnummer) return null;

    const fom = tilkommenInntekt.periode.fom;
    const tom = tilkommenInntekt.periode.tom;

    const organisasjonsnavn = orgData?.organisasjon?.navn;

    const arbeidsgivere = person?.arbeidsgivere ?? [];
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => dag.dato >= fom && dag.dato <= tom);
    const arbeidsgiverrad = arbeidsgiverdager.reduce((acc: string[], arbeidsgierdag) => {
        if (arbeidsgierdag.arbeidsgivere.length > acc.length) {
            return arbeidsgierdag.arbeidsgivere.map((dag) => dag.navn);
        } else {
            return acc;
        }
    }, []);
    const inntektPerDag = Number(tilkommenInntekt.periodebelop) / tilkommenInntekt.dager.length;

    return (
        <Box overflowX="scroll">
            <HStack wrap={false}>
                <VStack paddingBlock="8 6" paddingInline="2 0">
                    <Box
                        background={'surface-subtle'}
                        borderWidth="0 0 0 3"
                        style={{ borderColor: 'transparent' }}
                        paddingBlock="4"
                        paddingInline={'10'}
                        minWidth={'390px'}
                        maxWidth={'630px'}
                    >
                        <VStack marginBlock="4 4" gap="2">
                            <HStack align="end" gap="2">
                                <PlusCircleIcon />
                                <AnonymizableTextWithEllipsis weight="semibold">
                                    {organisasjonsnavn}
                                </AnonymizableTextWithEllipsis>
                                <HStack>
                                    <BodyShort weight="semibold">(</BodyShort>
                                    <AnonymizableTextWithEllipsis weight="semibold">
                                        {organisasjonsnummer}
                                    </AnonymizableTextWithEllipsis>
                                    <CopyButton
                                        copyText={organisasjonsnummer}
                                        size="xsmall"
                                        title="Kopier organisasjonsnummer"
                                        onClick={(event) => event.stopPropagation()}
                                    />
                                    <BodyShort weight="semibold">)</BodyShort>
                                </HStack>
                            </HStack>
                        </VStack>
                        <VStack marginBlock="4 4" gap="2">
                            <HStack wrap={false} gap="24">
                                <VStack>
                                    <BodyShort weight="semibold">Periode f.o.m.</BodyShort>
                                    <BodyShort>{somNorskDato(fom)}</BodyShort>
                                </VStack>
                                <VStack>
                                    <BodyShort weight="semibold">Periode t.o.m.</BodyShort>
                                    <BodyShort>{somNorskDato(tom)}</BodyShort>
                                </VStack>
                            </HStack>
                        </VStack>
                        <HStack wrap gap="12" marginBlock="4 4">
                            <VStack>
                                <BodyShort weight="semibold">Inntekt for perioden</BodyShort>
                                <BodyShort>{somPenger(Number(tilkommenInntekt.periodebelop))}</BodyShort>
                            </VStack>
                            <VStack>
                                <BodyShort weight="semibold">Inntekt per dag</BodyShort>
                                <BodyShort>
                                    {Number.isNaN(inntektPerDag) || !Number.isFinite(inntektPerDag)
                                        ? ''
                                        : somPenger(inntektPerDag)}
                                </BodyShort>
                            </VStack>
                        </HStack>
                    </Box>
                </VStack>
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
                            {arbeidsgiverdager.map((dag) => (
                                <Table.Row
                                    key={dag.dato + 'row'}
                                    className={cn(
                                        erHelg(dag.dato) && styles.helg,
                                        !tilkommenInntekt.dager.includes(dag.dato) &&
                                            !erHelg(dag.dato) &&
                                            styles.valgteDatoer,
                                    )}
                                >
                                    <Table.DataCell>
                                        <span id={`id-${dag.dato}`}>{somNorskDato(dag.dato)}</span>
                                    </Table.DataCell>
                                    {dag.arbeidsgivere.map((arbeidsgiver) => (
                                        <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                            <HStack gap="1" align="center" paddingInline="1 0" wrap={false}>
                                                <div className={styles.icon}>
                                                    {getTypeIcon(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                                </div>
                                                <BodyShort style={{ whiteSpace: 'nowrap' }}>
                                                    {dekorerTekst(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                                </BodyShort>
                                            </HStack>
                                        </Table.DataCell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Box>
            </HStack>
        </Box>
    );
};
