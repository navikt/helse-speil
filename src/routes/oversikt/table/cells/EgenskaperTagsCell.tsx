import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { Kategori } from '@io/graphql';
import { ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { kategoriForEgenskap } from '@state/oppgaver';

import styles from '../table.module.css';

interface EgenskaperTagsCellProps {
    egenskaper: ApiEgenskap[];
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
