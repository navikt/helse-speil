import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { Tag } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { NORSK_DATOFORMAT } from '@utils/date';

import styles from './PersonHeader.module.css';

interface DødsdatoTagProps {
    dødsdato?: Maybe<string>;
}

export const DødsdatoTag: React.FC<DødsdatoTagProps> = ({ dødsdato }) => {
    if (!dødsdato) {
        return null;
    }

    return (
        <AnonymizableContainer>
            <Tag variant="info" size="medium" className={classNames(styles.Tag, styles.dødsdato)}>
                Dødsdato {dayjs(dødsdato)?.format(NORSK_DATOFORMAT)}
            </Tag>
        </AnonymizableContainer>
    );
};
