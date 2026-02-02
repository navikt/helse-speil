'use client';

import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { BodyShort, GlobalAlert, HStack } from '@navikt/ds-react';

import { Driftsmelding as DriftsmeldingType, useDriftsmelding } from '@external/sanity';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './Driftsmeldinger.module.scss';

interface DriftsmeldingProps {
    driftsmelding: DriftsmeldingType;
}

export const Driftsmeldinger = (): ReactElement[] => {
    const { driftsmeldinger } = useDriftsmelding();

    return R.sortBy(driftsmeldinger, [R.prop('_updatedAt'), 'desc']).map((driftsmelding, index) => (
        <Driftsmelding key={index} driftsmelding={driftsmelding} />
    ));
};

const Driftsmelding = ({ driftsmelding }: DriftsmeldingProps): ReactElement | null => {
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

    return (
        <GlobalAlert status={status} size="medium" onClick={() => setÅpneDriftsmelding((prev) => !prev)}>
            <GlobalAlert.Header>
                <GlobalAlert.Title>{tittel}</GlobalAlert.Title>
                <HStack margin="space-8">
                    <BodyShort className={styles.dato}>{dato(driftsmelding, erLøst)}</BodyShort>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={classNames(styles.chevron, åpneDriftsmelding && styles.chevronrotated)}
                    />
                </HStack>
            </GlobalAlert.Header>
            {åpneDriftsmelding && (
                <GlobalAlert.Content>
                    {driftsmelding.arsak + '. '}
                    {driftsmelding.tiltak + '. '}
                    {driftsmelding.oppdatering ? driftsmelding.oppdatering + '. ' : ''}
                    {driftsmelding.cta ? driftsmelding.cta + '.' : ''}
                </GlobalAlert.Content>
            )}
        </GlobalAlert>
    );
};

function dato(driftsmelding: DriftsmeldingType, erLøst: boolean): string {
    const created = driftsmelding._createdAt.toString();
    const updated = driftsmelding._updatedAt.toString();

    if (erLøst) {
        return `(Løst: ${getFormattedDatetimeString(updated)})`;
    }
    return `(Oppdatert: ${getFormattedDatetimeString(created)})`;
}
