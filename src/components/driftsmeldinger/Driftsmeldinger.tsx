'use client';

import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { BodyShort, GlobalAlert, HStack, InfoCard } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Driftsmelding, Informasjonsmelding, useDriftsmelding, useInformasjonsmelding } from '@external/sanity';
import { getFormattedDatetimeString } from '@utils/date';
import { cn } from '@utils/tw';

import styles from './Driftsmeldinger.module.scss';

interface DriftsmeldingProps {
    driftsmelding: Driftsmelding;
}
interface InformasjonsmeldingProps {
    informasjonsmelding: Informasjonsmelding;
}

export const Driftsmeldinger = (): ReactElement[] => {
    const { driftsmeldinger } = useDriftsmelding();
    const { informasjonsmeldinger } = useInformasjonsmelding();

    const drift = R.sortBy(driftsmeldinger, [R.prop('_updatedAt'), 'desc']).map((driftsmelding) => (
        <DriftsmeldingInnhold key={`drift-${driftsmelding._id}`} driftsmelding={driftsmelding} />
    ));

    const info = R.sortBy(informasjonsmeldinger, [R.prop('_updatedAt'), 'desc']).map((informasjonsmelding) => (
        <InformasjonsmeldingInnhold key={`info-${informasjonsmelding._id}`} informasjonsmelding={informasjonsmelding} />
    ));

    return [...drift, ...info];
};

const DriftsmeldingInnhold = ({ driftsmelding }: DriftsmeldingProps): ReactElement | null => {
    const [åpneDriftsmelding, setÅpneDriftsmelding] = useState(false);
    type Konsekvens = 'treghet' | 'delvisMulig' | 'ikkeMulig';

    const erLøst = driftsmelding.lost === 'true';

    const titler: Record<Konsekvens, string> = {
        treghet: 'Treghet i speil',
        delvisMulig: 'Delvis mulig å saksbehandle i speil',
        ikkeMulig: 'Ikke mulig å saksbehandle i speil',
    };

    const konsekvens = driftsmelding.konsekvens as Konsekvens;

    const tittel = titler[konsekvens];
    let status: 'success' | 'warning' | 'error';
    if (erLøst) {
        status = 'success';
    } else if (konsekvens === 'treghet' || konsekvens === 'delvisMulig') {
        status = 'warning';
    } else {
        status = 'error';
    }

    const medPunktum = (uryddetTekst?: string) => {
        const ryddetTekst = uryddetTekst?.trim();
        if (!ryddetTekst) return '';
        return ryddetTekst.endsWith('.') ? `${ryddetTekst} ` : `${ryddetTekst}. `;
    };

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
                    <BodyShort className={styles.dato}>{dato(driftsmelding, erLøst)}</BodyShort>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={cn(styles.chevron, åpneDriftsmelding && styles.chevronrotated)}
                    />
                </HStack>
            </GlobalAlert.Header>
            {åpneDriftsmelding && (
                <GlobalAlert.Content>
                    {medPunktum(driftsmelding.arsak)}
                    {medPunktum(driftsmelding.tiltak)}
                    {medPunktum(driftsmelding.oppdatering)}
                    {medPunktum(driftsmelding.cta)}
                </GlobalAlert.Content>
            )}
        </GlobalAlert>
    );
};

const InformasjonsmeldingInnhold = ({ informasjonsmelding }: InformasjonsmeldingProps): ReactElement | null => {
    const [åpneInformasjonsmelding, setÅpneInformasjonsmelding] = useState(false);
    return (
        <InfoCard
            data-color="info"
            size="medium"
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

function dato(driftsmelding: Driftsmelding, erLøst: boolean): string {
    const created = driftsmelding._createdAt.toString();
    const updated = driftsmelding._updatedAt.toString();

    if (erLøst) {
        return `(Løst: ${getFormattedDatetimeString(updated)})`;
    }
    return `(Oppdatert: ${getFormattedDatetimeString(created)})`;
}
