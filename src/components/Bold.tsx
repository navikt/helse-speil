import classNames from 'classnames';
import React from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import styles from './Bold.module.css';

export const Bold: React.FC<BodyShortProps> = (props) => (
    <BodyShort as="p" {...props} className={classNames(styles.bold, props.className)} />
);
