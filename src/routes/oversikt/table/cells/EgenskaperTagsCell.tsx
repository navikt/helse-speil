import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { Kategori, Oppgaveegenskap } from '@io/graphql';

import styles from '../table.module.css';

interface EgenskaperTagsCellProps {
    egenskaper: Oppgaveegenskap[];
}

export const EgenskaperTagsCell = ({ egenskaper }: EgenskaperTagsCellProps): ReactElement => {
    return (
        <Table.DataCell>
            <span className={styles.flexCell}>
                <EgenskaperTags
                    egenskaper={egenskaper.filter((egenskap) => egenskap.kategori !== Kategori.Inntektsforhold)}
                />
            </span>
        </Table.DataCell>
    );
};
