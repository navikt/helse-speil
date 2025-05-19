import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { PersonPencilIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, HGrid, HStack, Heading, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { FjernTilkommenInntektDocument, Maybe } from '@/io/graphql';
import { useMutation } from '@apollo/client';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { FjernTilkommenInntektModal } from '@saksbilde/tilkommenInntekt/FjernTilkommenInntektModal';
import { TilkommenInntektArbeidsgivernavn } from '@saksbilde/tilkommenInntekt/TilkommenInntektArbeidsgivernavn';
import { TilkommenInntektDagoversikt } from '@saksbilde/tilkommenInntekt/TilkommenInntektDagoversikt';
import { beregnInntektPerDag, tabellArbeidsdager } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { erIPeriode, getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

interface TilkommenInntektVisningProps {
    tilkommenInntektId: string;
}

export const TilkommenInntektVisning = ({ tilkommenInntektId }: TilkommenInntektVisningProps): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData, refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(
        person?.fodselsnummer,
    );
    const router = useRouter();
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
    const { loading: organisasjonLoading, data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);

    const [showFjernModal, setShowFjernModal] = useState(false);
    const [showFjernTextArea, setShowFjernTextArea] = useState(false);

    if (!tilkommenInntekt || !organisasjonsnummer) return null;

    const arbeidsgivere = person?.arbeidsgivere ?? [];
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) =>
        erIPeriode(dag.dato, tilkommenInntekt.periode),
    );
    const arbeidsgiverrad = arbeidsgiverdager.reduce((acc: string[], arbeidsgierdag) => {
        if (arbeidsgierdag.arbeidsgivere.length > acc.length) {
            return arbeidsgierdag.arbeidsgivere.map((dag) => dag.navn);
        } else {
            return acc;
        }
    }, []);

    const inntektPerDag = beregnInntektPerDag(
        Number(tilkommenInntekt.periodebelop),
        tilkommenInntekt.periode.fom,
        tilkommenInntekt.periode.tom,
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
            {tilkommenInntekt.fjernet && (
                <Button
                    variant="tertiary"
                    size="small"
                    icon={<PersonPencilIcon />}
                    onClick={() => router.push(tilkommenInntektId + '/gjenopprett')}
                >
                    Gjenopprett
                </Button>
            )}
            {!tilkommenInntekt.fjernet && (
                <Button
                    variant="tertiary"
                    size="small"
                    icon={<PersonPencilIcon />}
                    onClick={() => router.push(tilkommenInntektId + '/endre')}
                >
                    Endre
                </Button>
            )}
            <HStack wrap={false}>
                <VStack paddingBlock="8 6" paddingInline="0 0">
                    <Box
                        background={'surface-subtle'}
                        borderWidth="0 0 0 3"
                        style={{ borderColor: 'transparent' }}
                        paddingBlock="4 5"
                        paddingInline="6"
                        minWidth={'630px'}
                    >
                        <VStack gap="4" align="start">
                            <VStack gap="4" paddingInline="2">
                                <TilkommenInntektArbeidsgivernavn
                                    organisasjonsnummer={organisasjonsnummer}
                                    organisasjonLoading={organisasjonLoading}
                                    organisasjonsnavn={organisasjonData?.organisasjon?.navn ?? undefined}
                                />
                                <HGrid columns={2} gap="2" width="450px" paddingInline="7">
                                    <VStack>
                                        <BodyShort weight="semibold">Periode f.o.m.</BodyShort>
                                        <BodyShort>{somNorskDato(tilkommenInntekt.periode.fom)}</BodyShort>
                                    </VStack>
                                    <VStack>
                                        <BodyShort weight="semibold">Periode t.o.m.</BodyShort>
                                        <BodyShort>{somNorskDato(tilkommenInntekt.periode.tom)}</BodyShort>
                                    </VStack>
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
                                </HGrid>
                            </VStack>
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
                                        <Heading size="xsmall" level="4">
                                            Fjern periode
                                        </Heading>
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
                        </VStack>
                    </Box>
                </VStack>
                <TilkommenInntektDagoversikt
                    arbeidsgiverrad={arbeidsgiverrad}
                    ekskluderteUkedager={tilkommenInntekt.ekskluderteUkedager}
                    arbeidsgiverdager={arbeidsgiverdager}
                />
            </HStack>
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
