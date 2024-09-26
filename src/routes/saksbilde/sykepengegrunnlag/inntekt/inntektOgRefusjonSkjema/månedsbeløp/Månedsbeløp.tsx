import React from 'react';

import { BodyShort, ErrorMessage, HStack } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { toKronerOgØre } from '@utils/locale';

import { MånedsbeløpInput } from './MånedsbeløpInput';

import styles from '../InntektOgRefusjonSkjema.module.css';

interface MånedsbeløpProps {
    månedsbeløp: number;
    kilde: string;
    lokaltMånedsbeløp: Maybe<number>;
    harEndringer: boolean;
    feilmelding?: string;
}

export const Månedsbeløp = ({ månedsbeløp, kilde, lokaltMånedsbeløp, harEndringer, feilmelding }: MånedsbeløpProps) => (
    <HStack>
        <div className={styles.Grid}>
            <BodyShort>Månedsbeløp</BodyShort>
            <MånedsbeløpInput
                initialMånedsbeløp={månedsbeløp}
                skalDeaktiveres={kilde === 'INFOTRYGD'}
                lokaltMånedsbeløp={lokaltMånedsbeløp}
            />
            {harEndringer && (
                <BodyShort className={styles.OpprinneligMånedsbeløp}>{toKronerOgØre(månedsbeløp)}</BodyShort>
            )}
            {feilmelding && (
                <ErrorMessage size="small" className={styles.error}>
                    {feilmelding}
                </ErrorMessage>
            )}
        </div>
        <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
    </HStack>
);
