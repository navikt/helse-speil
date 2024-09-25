import React from 'react';

import { BodyShort, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

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
    <div className={styles.Grid}>
        <BodyShort>Månedsbeløp</BodyShort>
        <VStack>
            <HStack gap="6" justify="end">
                <MånedsbeløpInput
                    initialMånedsbeløp={månedsbeløp}
                    skalDeaktiveres={kilde === 'INFOTRYGD'}
                    lokaltMånedsbeløp={lokaltMånedsbeløp}
                />
                {harEndringer && (
                    <BodyShort className={styles.OpprinneligMånedsbeløp}>{toKronerOgØre(månedsbeløp)}</BodyShort>
                )}
            </HStack>
            {feilmelding && <ErrorMessage size="small">{feilmelding}</ErrorMessage>}
        </VStack>
    </div>
);
