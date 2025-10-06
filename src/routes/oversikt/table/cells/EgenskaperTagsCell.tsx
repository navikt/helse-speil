import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { Egenskap, Kategori } from '@io/graphql';
import { kategoriForEgenskap } from '@state/oppgaver';

import styles from '../table.module.css';

interface EgenskaperTagsCellProps {
    egenskaper: Egenskap[];
}

export const EgenskaperTagsCell = ({ egenskaper }: EgenskaperTagsCellProps): ReactElement => {
    return (
        <Table.DataCell>
            <span className={styles.flexCell}>
                <EgenskaperTags
                    egenskaper={egenskaper.filter(
                        (egenskap) => kategoriForEgenskap(egenskap) !== Kategori.Inntektsforhold,
                    )}
                />
            </span>
        </Table.DataCell>
    );
};
