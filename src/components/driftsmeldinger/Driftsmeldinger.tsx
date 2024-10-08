'use client';

import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, BodyShort, HStack } from '@navikt/ds-react';

import { Driftsmelding as DriftsmeldingType, useDriftsmelding } from '@external/sanity';
import { Maybe } from '@io/graphql';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './Driftsmeldinger.module.scss';

export const Driftsmeldinger = () => {
    const { driftsmeldinger, loading, error } = useDriftsmelding();

    return R.sortBy(driftsmeldinger, [R.prop('opprettet'), 'desc']).map((driftsmelding, index) => {
        const harGått30min = dayjs(driftsmelding._updatedAt).add(30, 'minutes').isBefore(dayjs());
        if (harGått30min && driftsmelding.level === 'success') return null;

        return <Driftsmelding key={index} driftsmelding={driftsmelding} />;
    });
};

interface DriftsmeldingProps {
    driftsmelding: DriftsmeldingType;
}

const Driftsmelding = ({ driftsmelding }: DriftsmeldingProps): Maybe<ReactElement> => {
    const [show, setShow] = useState(true);
    const [åpneDriftsmelding, setÅpneDriftsmelding] = useState(false);

    return show ? (
        <Alert
            variant={driftsmelding.level}
            closeButton={driftsmelding.level === 'info' || driftsmelding.level === 'success'}
            onClose={() => setShow(false)}
            onClick={() => setÅpneDriftsmelding(!åpneDriftsmelding)}
            className={styles.driftsmelding}
        >
            <HStack gap="2">
                <BodyShort className={styles.tittel}>
                    {driftsmelding.level === 'success' ? `[Løst] ${driftsmelding.tittel}` : driftsmelding.tittel}
                </BodyShort>
                <BodyShort className={styles.dato}>
                    ({getFormattedDatetimeString(driftsmelding.opprettet.toString())})
                </BodyShort>
                <span className={styles.button}>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={classNames(styles.chevron, åpneDriftsmelding && styles.chevronrotated)}
                    />
                </span>
            </HStack>
            {åpneDriftsmelding && <BodyLong className={styles.melding}>{driftsmelding.melding}</BodyLong>}
        </Alert>
    ) : null;
};
