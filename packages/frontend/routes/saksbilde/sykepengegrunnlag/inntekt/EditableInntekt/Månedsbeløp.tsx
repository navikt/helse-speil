import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { toKronerOgØre } from '@utils/locale';

import { MånedsbeløpInput } from '../MånedsbeløpInput';

import styles from './EditableInntekt.module.css';

interface MånedsbeløpProps {
    månedsbeløp: number;
    kilde: string;
    lokaltMånedsbeløp: Maybe<number>;
    harEndringer: boolean;
}

export const Månedsbeløp = ({ månedsbeløp, kilde, lokaltMånedsbeløp, harEndringer }: MånedsbeløpProps) => (
    <div className={styles.Grid}>
        <BodyShort>Månedsbeløp</BodyShort>
        <Flex gap="1rem">
            <MånedsbeløpInput
                initialMånedsbeløp={månedsbeløp}
                skalDeaktiveres={kilde === 'INFOTRYGD'}
                lokaltMånedsbeløp={lokaltMånedsbeløp}
            />
            <p className={classNames(styles.OpprinneligMånedsbeløp, harEndringer && styles.harEndringer)}>
                {toKronerOgØre(månedsbeløp)}
            </p>
        </Flex>
    </div>
);
