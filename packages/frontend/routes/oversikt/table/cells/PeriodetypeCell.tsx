import React from 'react';

import { Table } from '@navikt/ds-react';

import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Periodetype } from '@io/graphql';

import styles from '../table.module.css';

const getLabel = (type: Periodetype) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'Forlengelse';
        case Periodetype.Forstegangsbehandling:
            return 'Førstegang.';
        case Periodetype.OvergangFraIt:
            return 'Forlengelse IT';
    }
};

interface PeriodetypeCellProps {
    type: Periodetype;
}

export const PeriodetypeCell = ({ type }: PeriodetypeCellProps) => {
    return (
        <Table.DataCell align="center">
            <span className={styles.flexCell}>
                <Oppgaveetikett type={type} />
                {getLabel(type)}
            </span>
        </Table.DataCell>
    );
};
