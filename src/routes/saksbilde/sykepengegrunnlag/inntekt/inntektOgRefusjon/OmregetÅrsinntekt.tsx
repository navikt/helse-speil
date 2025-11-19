import React from 'react';

import { BodyShort, HStack, HStackProps } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { somPenger } from '@utils/locale';

import styles from './OmregnetÅrsinntekt.module.css';

type OmregnetÅrsinntektProps = {
    omregnetÅrsintekt: number | undefined;
    gap?: HStackProps['gap'];
    harLokaltMånedsbeløp?: boolean;
};

export const OmregnetÅrsinntekt = ({ omregnetÅrsintekt, gap, harLokaltMånedsbeløp }: OmregnetÅrsinntektProps) => (
    <HStack gap={gap}>
        <BodyShort>Omregnet årsinntekt</BodyShort>
        <div style={{ position: 'relative', paddingLeft: '1rem' }}>
            {harLokaltMånedsbeløp ? (
                <>
                    <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                    <BodyShort weight="semibold" className={styles.omregnet}>
                        {somPenger(omregnetÅrsintekt)}
                    </BodyShort>
                </>
            ) : (
                <BodyShort weight="semibold">{somPenger(omregnetÅrsintekt)}</BodyShort>
            )}
        </div>
    </HStack>
);
