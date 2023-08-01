import React from 'react';

import { Table } from '@navikt/ds-react';

import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Oppgavetype } from '@io/graphql';

import styles from '../table.module.css';

const getLabelForOppgavetype = (type: Oppgavetype): string => {
    switch (type) {
        case Oppgavetype.FortroligAdresse: {
            return 'Fortrolig adr.';
        }
        case Oppgavetype.Revurdering: {
            return 'Revurdering';
        }
        case Oppgavetype.RiskQa: {
            return 'Risk QA';
        }
        case Oppgavetype.Stikkprove: {
            return 'Stikkprøve';
        }
        case Oppgavetype.Soknad:
        case Oppgavetype.DelvisRefusjon:
        case Oppgavetype.UtbetalingTilSykmeldt: {
            return 'Søknad';
        }
        default: {
            return 'Ukjent';
        }
    }
};

interface OppgavetypeCellProps {
    oppgavetype: Oppgavetype;
}

export const OppgavetypeCell = ({ oppgavetype }: OppgavetypeCellProps) => {
    const label = getLabelForOppgavetype(oppgavetype);
    return (
        <Table.DataCell>
            <span className={styles.flexCell}>
                <Oppgaveetikett type={oppgavetype} />
                {label}
            </span>
        </Table.DataCell>
    );
};
