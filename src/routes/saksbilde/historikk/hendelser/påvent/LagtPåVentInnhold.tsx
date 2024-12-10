import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement } from 'react';

import { BodyLong, BodyShort, HStack, VStack } from '@navikt/ds-react';

import styles from '@saksbilde/historikk/hendelser/ExpandableHendelse.module.scss';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { somNorskDato } from '@utils/date';

interface LagtPåventinnholdProps {
    expanded: boolean;
    tekst?: string;
    årsaker: string[];
    frist: string;
}

export const LagtPåventinnhold = ({ expanded, tekst, årsaker, frist }: LagtPåventinnholdProps): ReactElement => (
    <VStack gap="2">
        <ÅrsakListe årsaker={årsaker} />
        <HStack gap="1">
            <BodyShort>Frist:</BodyShort>
            <BodyShort weight="semibold">{somNorskDato(frist)}</BodyShort>
        </HStack>
        <AnimatePresence mode="wait">
            {expanded && (
                <motion.div
                    key="div"
                    className={styles.animertUtvidetInnhold}
                    initial={{ height: 0 }}
                    exit={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{
                        type: 'tween',
                        duration: 0.2,
                        ease: 'easeInOut',
                    }}
                >
                    {tekst && (
                        <div>
                            {tekst && <BodyShort weight="semibold">Notat</BodyShort>}
                            <BodyLong className={styles.tekstMedLinjeskift}>{tekst}</BodyLong>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </VStack>
);
