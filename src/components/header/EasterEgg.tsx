import dayjs from 'dayjs';
import Image from 'next/image';
import React, { ReactElement } from 'react';

import julegurken from '@assets/topplinjebilder/julegurken.svg';
import påskegurken from '@assets/topplinjebilder/påskegurken.svg';
import sommergurken from '@assets/topplinjebilder/sommergurken.svg';
import { ISO_DATOFORMAT } from '@utils/date';

import styles from './EasterEgg.module.css';

export const EasterEgg = (): ReactElement => (
    <div className={styles.container}>
        <Julepynt />
        <Påskepynt />
        <Sommergurken />
    </div>
);

const Påskepynt = (): ReactElement | null =>
    dayjs() < dayjs('2024-04-02', ISO_DATOFORMAT) ? (
        <Image style={{ margin: '-4px 0 -5px 1.5rem' }} alt="Påskepynt" src={påskegurken} />
    ) : null;

const Julepynt = (): ReactElement | null =>
    dayjs().get('month') == 11 ? <Image style={{ marginLeft: '1.5rem' }} alt="Julepynt" src={julegurken} /> : null;

const Sommergurken = (): ReactElement | null =>
    dayjs().get('month') == 6 ? <Image style={{ marginLeft: '1.5rem' }} alt="Sommerpynt" src={sommergurken} /> : null;
