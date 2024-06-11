import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Notat } from '@/types/notat';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import styles from './SisteNotat.module.css';

interface SisteNotatProps {
    notat: Notat;
}

export const SisteNotat: React.FC<SisteNotatProps> = ({ notat }) => (
    <BodyShort as="p" className={styles.siste}>
        {notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)} : {notat.tekst}
    </BodyShort>
);
