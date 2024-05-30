import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { BodyShortProps } from '@navikt/ds-react/esm/typography/BodyShort';

import styles from './Bold.module.css';

export const Bold: React.FC<BodyShortProps> = (props) => (
    <BodyShort as="p" {...props} className={classNames(styles.bold, props.className)} />
);
