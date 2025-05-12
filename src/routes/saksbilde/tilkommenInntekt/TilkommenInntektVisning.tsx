import cn from 'classnames';
import React, { ReactElement, useState } from 'react';

import { PlusCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, CopyButton, HStack, Heading, Table, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { FjernTilkommenInntektDocument, Maybe } from '@/io/graphql';
import { useMutation } from '@apollo/client';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { FjernTilkommenInntektModal } from '@saksbilde/tilkommenInntekt/FjernTilkommenInntektModal';
import styles from '@saksbilde/tilkommenInntekt/TilkommenTable.module.css';
import {
    beregnInntektPerDag,
    dekorerTekst,
    getTypeIcon,
    tabellArbeidsdager,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { erHelg, getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver, somPenger } from '@utils/locale';

interface TilkommenInntektVisningProps {
    tilkommenInntektId: string;
}

export const TilkommenInntektVisning = ({ tilkommenInntektId }: TilkommenInntektVisningProps): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData, refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(
        person?.fodselsnummer,
    );
    const [fjernTilkommenInntekt] = useMutation(FjernTilkommenInntektDocument);
    const [fjerningBegrunnelse, setFjerningBegrunnelse] = useState<string>('');
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

    const [showFjernModal, setShowFjernModal] = useState(false);
    const [showFjernTextArea, setShowFjernTextArea] = useState(false);

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
    const inntektPerDag = beregnInntektPerDag(
        Number(tilkommenInntekt.periodebelop),
        fom,
        tom,
        tilkommenInntekt.ekskluderteUkedager,
    );

    const fjernetEvent = tilkommenInntekt.events.findLast(
        (event) => event.__typename == 'TilkommenInntektFjernetEvent',
    );
    const handleFjern = async () => {
        setShowFjernTextArea(false);
        setShowFjernModal(false);
        await fjernTilkommenInntekt({
            variables: {
                notatTilBeslutter: fjerningBegrunnelse,
                tilkommenInntektId: tilkommenInntektId,
            },
            onCompleted: () => tilkommenInntektRefetch(),
        });
    };
    return (
        <>
            <Box overflowX="scroll">
                <HStack wrap={false}>
                    <VStack paddingBlock="8 6" paddingInline="2 0">
                        <Box
                            background={'surface-subtle'}
                            borderWidth="0 0 0 3"
                            style={{ borderColor: 'transparent' }}
                            paddingBlock="12 10"
                            paddingInline="12 10"
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
                            {tilkommenInntekt.fjernet && (
                                <Alert variant="info">
                                    <Heading size="xsmall" level="4">
                                        Perioden er fjernet
                                    </Heading>
                                    <BodyShort>
                                        Fjernet av: {fjernetEvent?.metadata?.utfortAvSaksbehandlerIdent}
                                    </BodyShort>
                                    <BodyShort>
                                        Tidspunkt: {getFormattedDatetimeString(fjernetEvent?.metadata?.tidspunkt)}
                                    </BodyShort>
                                </Alert>
                            )}
                            {!tilkommenInntekt.fjernet && !showFjernTextArea && (
                                <Button
                                    variant="tertiary"
                                    size="small"
                                    icon={<XMarkOctagonIcon />}
                                    onClick={() => setShowFjernTextArea(true)}
                                >
                                    Fjern periode
                                </Button>
                            )}
                            {!tilkommenInntekt.fjernet && showFjernTextArea && (
                                <VStack>
                                    <HStack>
                                        <BodyShort>Fjern periode</BodyShort>
                                        <Button
                                            variant="tertiary"
                                            size="small"
                                            onClick={() => setShowFjernTextArea(false)}
                                        >
                                            Avbryt
                                        </Button>
                                    </HStack>
                                    <Textarea
                                        label="Begrunn hvorfor perioden fjernes"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                        value={fjerningBegrunnelse}
                                        onChange={(event) => setFjerningBegrunnelse(event.target.value)}
                                    />
                                    <HStack>
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => {
                                                setShowFjernModal(true);
                                            }}
                                        >
                                            Lagre
                                        </Button>
                                        <Button
                                            variant="tertiary"
                                            size="small"
                                            onClick={() => setShowFjernTextArea(false)}
                                        >
                                            Avbryt
                                        </Button>
                                    </HStack>
                                </VStack>
                            )}
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
                                            tilkommenInntekt.ekskluderteUkedager.includes(dag.dato) &&
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
            {showFjernModal && (
                <FjernTilkommenInntektModal
                    tilkommenInntekt={tilkommenInntekt}
                    onConfirm={handleFjern}
                    onCancel={() => setShowFjernModal(false)}
                />
            )}
        </>
    );
};
