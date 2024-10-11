import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Notat } from '@typer/notat';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import styles from './SisteNotat.module.css';

interface SisteNotatProps {
    notat: Notat;
}

export const SisteNotat = ({ notat }: SisteNotatProps): ReactElement => (
    <BodyShort className={styles.siste}>
        {notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)} : {notat.tekst}
    </BodyShort>
);
