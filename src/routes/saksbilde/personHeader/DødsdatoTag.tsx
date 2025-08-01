import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Maybe } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';

import styles from './PersonHeader.module.css';

interface DødsdatoTagProps {
    dødsdato?: Maybe<string>;
}

export const DødsdatoTag = ({ dødsdato }: DødsdatoTagProps): ReactElement | null => {
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
