import React from 'react';

import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import styles from './TilleggsinfoKnapp.module.css';

interface TilleggsinfoKnappProps {
    onClick: () => void;
}

export const TilleggsinfoKnapp = ({ onClick }: TilleggsinfoKnappProps) => (
    <button className={styles.button} type="button" onClick={onClick}>
        <SortInfoikon />
    </button>
);
