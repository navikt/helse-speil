import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { toKronerOgØre } from '@utils/locale';
import { Maybe } from '@utils/ts';

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
        <div className={styles.månedsbeløp}>
            <MånedsbeløpInput
                initialMånedsbeløp={månedsbeløp}
                skalDeaktiveres={kilde === 'INFOTRYGD'}
                lokaltMånedsbeløp={lokaltMånedsbeløp}
            />
            <p className={classNames(styles.OpprinneligMånedsbeløp, harEndringer && styles.harEndringer)}>
                {toKronerOgØre(månedsbeløp)}
            </p>
        </div>
    </div>
);
