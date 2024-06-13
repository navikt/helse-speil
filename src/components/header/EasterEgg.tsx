import dayjs from 'dayjs';
import React from 'react';

import julegurken from '@assets/topplinjebilder/julegurken.svg';
import påskegurken from '@assets/topplinjebilder/påskegurken.svg';
import sommergurken from '@assets/topplinjebilder/sommergurken.svg';
import { ISO_DATOFORMAT } from '@utils/date';

import styles from './EasterEgg.module.css';

export const EasterEgg = () => (
    <div className={styles.container}>
        <Julepynt />
        <Påskepynt />
        <Sommergurken />
    </div>
);

const Påskepynt = () =>
    dayjs() < dayjs('2024-04-02', ISO_DATOFORMAT) ? (
        <img style={{ margin: '-4px 0 -5px 1.5rem' }} alt="Påskepynt" src={påskegurken} />
    ) : null;

const Julepynt = () =>
    dayjs().get('month') == 11 ? <img style={{ marginLeft: '1.5rem' }} alt="Julepynt" src={julegurken} /> : null;

const Sommergurken = () =>
    dayjs().get('month') == 6 ? <img style={{ marginLeft: '1.5rem' }} alt="Sommerpynt" src={sommergurken} /> : null;
