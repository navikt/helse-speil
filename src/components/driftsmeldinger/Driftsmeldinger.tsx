'use client';

import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, GlobalAlert, HStack, InfoCard, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useDriftsmelding, useInformasjonsmelding } from '@external/sanity';
import type { DriftsmeldingerQueryResult, InformasjonsmeldingerQueryResult } from '@io/sanity/generated/sanity.types';
import { getFormattedDatetimeString } from '@utils/date';
import { cn } from '@utils/tw';

import styles from './Driftsmeldinger.module.scss';

type Driftsstatus = DriftsmeldingerQueryResult[number]['statuser'][number];

interface DriftsmeldingProps {
    driftsmelding: DriftsmeldingerQueryResult[number];
}
interface InformasjonsmeldingProps {
    informasjonsmelding: InformasjonsmeldingerQueryResult[number];
}

export const Driftsmeldinger = (): ReactElement => (
    <ErrorBoundary
        fallback={
            <GlobalAlert status="warning" size="medium">
                <GlobalAlert.Header>
                    <GlobalAlert.Title>Kunne ikke vise driftsmeldinger.</GlobalAlert.Title>
                </GlobalAlert.Header>
            </GlobalAlert>
        }
    >
        <DriftsmeldingerListe />
    </ErrorBoundary>
);

const DriftsmeldingerListe = (): ReactElement => {
    const { driftsmeldinger } = useDriftsmelding();
    const { informasjonsmeldinger } = useInformasjonsmelding();

    const drift = R.sortBy(driftsmeldinger, [R.prop('_updatedAt'), 'desc']).map((driftsmelding) => (
        <DriftsmeldingInnhold key={`drift-${driftsmelding._id}`} driftsmelding={driftsmelding} />
    ));

    const info = R.sortBy(informasjonsmeldinger, [R.prop('_updatedAt'), 'desc']).map((informasjonsmelding) => (
        <InformasjonsmeldingInnhold key={`info-${informasjonsmelding._id}`} informasjonsmelding={informasjonsmelding} />
    ));

    return <>{[...drift, ...info]}</>;
};

const DriftsmeldingInnhold = ({ driftsmelding }: DriftsmeldingProps): ReactElement | null => {
    const [åpneDriftsmelding, setÅpneDriftsmelding] = useState(false);

    const erLøst = driftsmelding.lost === 'true';

    const sorterteStatuser = R.sortBy(driftsmelding.statuser ?? [], [R.prop('tidspunkt'), 'desc']);
    const [gjeldendeStatus, ...tidligereStatuser] = sorterteStatuser;

    if (!gjeldendeStatus) return null;

    const konsekvens = gjeldendeKonsekvens(sorterteStatuser);
    const tittel = konsekvensTittel(konsekvens);
    let status: 'success' | 'warning' | 'error';
    if (erLøst) {
        status = 'success';
    } else if (konsekvens === 'treghet' || konsekvens === 'delvisMulig') {
        status = 'warning';
    } else {
        status = 'error';
    }

    return (
        <GlobalAlert
            status={status}
            size="medium"
            onClick={() => setÅpneDriftsmelding((prev) => !prev)}
            className={styles.driftsmelding}
        >
            <GlobalAlert.Header>
                <GlobalAlert.Title>{tittel}</GlobalAlert.Title>
                <HStack margin="space-8">
                    <BodyShort className={styles.dato}>{dato(driftsmelding, gjeldendeStatus, erLøst)}</BodyShort>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={cn(styles.chevron, åpneDriftsmelding && styles.chevronrotated)}
                    />
                </HStack>
            </GlobalAlert.Header>
            {åpneDriftsmelding && (
                <GlobalAlert.Content>
                    <VStack gap="space-4">
                        {medPunktum(gjeldendeStatus.arsak)}
                        {medPunktum(gjeldendeStatus.tiltak)}
                        {medPunktum(gjeldendeStatus.oppdatering)}
                        {medPunktum(gjeldendeStatus.cta)}
                        {tidligereStatuser.length > 0 && (
                            <Box marginBlock="space-8 space-0">
                                <BodyShort weight="semibold" size="small">
                                    Tidligere statuser
                                </BodyShort>
                                <VStack gap="space-8" marginBlock="space-4 space-0">
                                    {tidligereStatuser.map((tidligereStatus) => (
                                        <TidligereStatus key={tidligereStatus._key} status={tidligereStatus} />
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </GlobalAlert.Content>
            )}
        </GlobalAlert>
    );
};

const TidligereStatus = ({ status }: { status: Driftsstatus }): ReactElement => (
    <Box>
        <BodyShort size="small" weight="semibold">
            {getFormattedDatetimeString(status.tidspunkt)}
            {status.konsekvens ? `: ${konsekvensTittel(status.konsekvens)}` : ''}
        </BodyShort>
        <BodyShort size="small">
            {medPunktum(status.arsak)}
            {medPunktum(status.tiltak)}
            {medPunktum(status.oppdatering)}
            {medPunktum(status.cta)}
        </BodyShort>
    </Box>
);

const InformasjonsmeldingInnhold = ({ informasjonsmelding }: InformasjonsmeldingProps): ReactElement | null => {
    const [åpneInformasjonsmelding, setÅpneInformasjonsmelding] = useState(false);
    return (
        <InfoCard
            data-color="info"
            size="small"
            onClick={() => setÅpneInformasjonsmelding((prev) => !prev)}
            className={styles.infomelding}
        >
            <InfoCard.Header>
                <InfoCard.Title>{informasjonsmelding.tittel}</InfoCard.Title>
                <HStack margin="space-8">
                    <BodyShort
                        className={styles.dato}
                    >{`(${getFormattedDatetimeString(informasjonsmelding._updatedAt)})`}</BodyShort>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={cn(styles.chevron, åpneInformasjonsmelding && styles.chevronrotated)}
                    />
                </HStack>
            </InfoCard.Header>
            {åpneInformasjonsmelding && (
                <GlobalAlert.Content>
                    <BodyShortWithPreWrap>{informasjonsmelding.beskrivelse}</BodyShortWithPreWrap>
                </GlobalAlert.Content>
            )}
        </InfoCard>
    );
};

function dato(
    driftsmelding: DriftsmeldingerQueryResult[number],
    gjeldendeStatus: Driftsstatus,
    erLøst: boolean,
): string {
    if (erLøst) {
        return `(Løst: ${getFormattedDatetimeString(driftsmelding._updatedAt.toString())})`;
    }
    return `(Oppdatert: ${getFormattedDatetimeString(gjeldendeStatus.tidspunkt)})`;
}

const konsekvensTitler: Record<string, string> = {
    treghet: 'Treghet i speil',
    delvisMulig: 'Delvis mulig å saksbehandle i speil',
    ikkeMulig: 'Ikke mulig å saksbehandle i speil',
};

function konsekvensTittel(konsekvens?: string | null): string {
    return (konsekvens && konsekvensTitler[konsekvens]) || 'Driftsmelding';
}

/**
 * Konsekvensen settes bare når den endrer seg, så vi går bakover i historikken til vi finner
 * den siste som faktisk er satt. Den bestemmer tittel og farge på hele driftsmeldingen.
 */
function gjeldendeKonsekvens(statuserNyesteFørst: Driftsstatus[]): string | null | undefined {
    return statuserNyesteFørst.find((status) => status.konsekvens)?.konsekvens;
}

function medPunktum(uryddetTekst?: string | null): string {
    const ryddetTekst = uryddetTekst?.trim();
    if (!ryddetTekst) return '';
    return ryddetTekst.endsWith('.') ? `${ryddetTekst} ` : `${ryddetTekst}. `;
}
