'use client';

import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement, useState } from 'react';
import * as R from 'remeda';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
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
    const [vis, kvitterUt] = useVisDriftsmelding(driftsmelding);
    const [åpneDriftsmelding, setÅpneDriftsmelding] = useState(false);

    const løst = driftsmelding.lost === 'true';
    const warning = driftsmelding.konsekvens === 'treghet' || driftsmelding.konsekvens === 'delvisMulig';
    const konsekvensmelding = warning ? 'warning' : 'error';

    const titler: Record<string, string> = {
        treghet: 'Treghet i speil',
        delvisMulig: 'Delvis mulig å saksbehandle i speil',
        ikkeMulig: 'Ikke mulig å saksbehandle i speil',
    };

    const tittel = titler[driftsmelding.konsekvens] ?? '';

    return vis ? (
        <Alert
            variant={løst ? 'success' : konsekvensmelding}
            closeButton={løst}
            onClose={() => kvitterUt()}
            onClick={() => setÅpneDriftsmelding(!åpneDriftsmelding)}
            className={styles.driftsmelding}
        >
            <HStack gap="space-8">
                <BodyShort className={styles.tittel}>
                    {driftsmelding.lost === 'true' ? `[Løst] ${tittel}` : tittel}
                </BodyShort>
                <BodyShort className={styles.dato}>{dato(driftsmelding)}</BodyShort>
                <span className={styles.button}>
                    <ChevronDownIcon
                        title="Vis mer"
                        fontSize="1.5rem"
                        className={classNames(styles.chevron, åpneDriftsmelding && styles.chevronrotated)}
                    />
                </span>
            </HStack>
            {åpneDriftsmelding && (
                <BodyShortWithPreWrap className={styles.melding}>
                    {driftsmelding.arsak + '. '}
                    {driftsmelding.tiltak + '. '}
                    {driftsmelding.oppdatering ? driftsmelding.oppdatering + '. ' : ''}
                    {driftsmelding.cta ? driftsmelding.cta + '.' : ''}
                </BodyShortWithPreWrap>
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
        return (key ? deserialized[key as string] : deserialized) as T extends string
            ? Detaljer
            : UtkvitterteDriftsmeldinger;
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

function dato(driftsmelding: DriftsmeldingType): string {
    const created = driftsmelding._createdAt.toString();
    const updated = driftsmelding._updatedAt.toString();

    if (updated !== created) {
        return `(Oppdatert: ${getFormattedDatetimeString(updated)})`;
    }
    return `(${getFormattedDatetimeString(created)})`;
}
