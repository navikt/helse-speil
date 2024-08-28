import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion, VStack } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { AvOgPåKnapper } from '@oversikt/filtermeny/AvOgPåKnapper';

import { Filter } from '../table/state/filter';

import styles from './FilterList.module.css';

interface FilterListProps extends React.HTMLAttributes<HTMLButtonElement> {
    filters: Filter[];
    text: string;
}

export const FilterList = ({ filters, text }: FilterListProps): ReactElement => {
    const [open, setOpen] = useState(true);

    return (
        <Accordion>
            <Accordion.Item defaultOpen className={styles.liste}>
                <Accordion.Header onClick={() => setOpen(!open)} className={styles.header}>
                    <Bold>{text}</Bold>
                </Accordion.Header>
                <Accordion.Content className={classNames(styles.innhold)}>
                    <VStack gap="2">
                        {filters.map((it) => (
                            <AvOgPåKnapper filter={it} key={it.key} />
                        ))}
                    </VStack>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
