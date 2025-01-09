'use client';

import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';

import { BodyLongWithPreWrap } from '@components/BodyLongWithPreWrap';
import { Driftsmelding as DriftsmeldingType, useDriftsmelding } from '@external/sanity';
import { Maybe } from '@io/graphql';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './Driftsmeldinger.module.scss';

interface DriftsmeldingProps {
    driftsmelding: DriftsmeldingType;
}

export const Driftsmeldinger = (): ReactElement[] => {
    const { driftsmeldinger } = useDriftsmelding();

    return R.sortBy(driftsmeldinger, [R.prop('opprettet'), 'desc']).map((driftsmelding, index) => (
        <Driftsmelding key={index} driftsmelding={driftsmelding} />
    ));
};

const Driftsmelding = ({ driftsmelding }: DriftsmeldingProps): Maybe<ReactElement> => {
    const [vis, kvitterUt] = useVisDriftsmelding(driftsmelding);
    const [åpneDriftsmelding, setÅpneDriftsmelding] = useState(false);

    return vis ? (
        <Alert
            variant={driftsmelding.level}
            closeButton={driftsmelding.level === 'info' || driftsmelding.level === 'success'}
            onClose={() => kvitterUt()}
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
            {åpneDriftsmelding && (
                <BodyLongWithPreWrap className={styles.melding}>{driftsmelding.melding}</BodyLongWithPreWrap>
            )}
        </Alert>
    ) : null;
};

type Detaljer = { klikketVekk: Dayjs | string };

type UtkvitterteDriftsmeldinger = { [key: string]: Detaljer };

function deserialize(value: string | null): UtkvitterteDriftsmeldinger {
    if (!value) return {};
    const parsed = JSON.parse(value) as UtkvitterteDriftsmeldinger;
    return Object.keys(parsed).reduce(
        (acc, key) => ({
            ...acc,
            [key]: { klikketVekk: dayjs(parsed[key]?.klikketVekk) },
        }),
        {},
    );
}

const useVisDriftsmelding = (driftsmelding: DriftsmeldingType): [boolean, () => void] => {
    const globalKey = 'driftsmeldinger';

    function get<T>(key?: T): T extends string ? Detaljer : UtkvitterteDriftsmeldinger {
        const value = localStorage.getItem(globalKey);
        const deserialized = deserialize(value);
        return (key ? deserialized[key as string] : deserialized) as any;
    }

    function set(utkvitterteDriftsmeldinger: UtkvitterteDriftsmeldinger) {
        localStorage.setItem(globalKey, JSON.stringify(utkvitterteDriftsmeldinger));
    }

    const keyForEnDriftsmelding = driftsmelding._id + ':' + driftsmelding._rev;

    const visDriftsmelding = get(keyForEnDriftsmelding) == null;

    const oppdaterLocalStorage = () => {
        const lagrede = get();
        lagrede[keyForEnDriftsmelding] = { klikketVekk: dayjs() };
        set(lagrede);
    };

    return [visDriftsmelding, oppdaterLocalStorage];
};
