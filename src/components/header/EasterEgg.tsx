import dayjs from 'dayjs';
import Image from 'next/image';
import React, { ReactElement } from 'react';

import julegurken from '@assets/topplinjebilder/julegurken.svg';
import nyttårsgurken from '@assets/topplinjebilder/nyttårsgurken.svg';
import påskegurken from '@assets/topplinjebilder/påskegurken.svg';
import sommergurken from '@assets/topplinjebilder/sommergurken.svg';
import { ISO_DATOFORMAT } from '@utils/date';

import styles from './EasterEgg.module.css';

export const EasterEgg = (): ReactElement => (
    <div className={styles.container}>
        <Julepynt />
        <Nyttårspynt />
        <Påskepynt />
        <Sommergurken />
    </div>
);

const Påskepynt = (): ReactElement | null =>
    dayjs() < dayjs('2025-04-22', ISO_DATOFORMAT) ? (
        <Image style={{ margin: '-4px 0 -5px 1.5rem' }} priority={true} alt="Påskepynt" src={påskegurken} />
    ) : null;

const Julepynt = (): ReactElement | null =>
    dayjs().get('month') == 11 && dayjs().get('date') <= 30 ? (
        <Image style={{ marginLeft: '1.5rem' }} priority={true} alt="Julepynt" src={julegurken} />
    ) : null;

const Nyttårspynt = (): ReactElement | null =>
    (dayjs().get('month') === 11 && dayjs().get('date') === 31) ||
    (dayjs().get('month') === 0 && dayjs().isoWeek() <= 2) ? (
        <Image style={{ marginLeft: '1.5rem' }} priority={true} alt="Nyttårspynt" src={nyttårsgurken} />
    ) : null;

const Sommergurken = (): ReactElement | null =>
    dayjs().get('month') == 6 ? (
        <Image style={{ marginLeft: '1.5rem' }} priority={true} alt="Sommerpynt" src={sommergurken} />
    ) : null;
