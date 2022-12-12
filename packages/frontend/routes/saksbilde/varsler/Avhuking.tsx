import classNames from 'classnames';
import React from 'react';

import { Checkmark } from './Checkmark';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    variant: String;
};

export const Avhuking: React.FC<AvhukingProps> = ({ variant }: AvhukingProps) => {
    return (
        <button className={classNames(styles.avhuking, styles[`avhuking-${variant}`])}>
            <Checkmark />
        </button>
    );
};
