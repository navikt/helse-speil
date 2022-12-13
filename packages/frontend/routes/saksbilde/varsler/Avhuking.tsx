import classNames from 'classnames';
import React from 'react';

import { CheckIcon } from '../timeline/icons';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    variant: String;
};

export const Avhuking: React.FC<AvhukingProps> = ({ variant }: AvhukingProps) => {
    return (
        <button className={classNames(styles.avhuking, styles[`avhuking-${variant}`])}>
            <CheckIcon width="24px" height="24px" />
        </button>
    );
};
