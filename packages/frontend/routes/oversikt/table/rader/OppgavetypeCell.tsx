import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Oppgavetype } from '@io/graphql';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

import styles from './OppgavetypeCell.module.css';

const getLabelForOppgavetype = (type: Oppgavetype): string => {
    switch (type) {
        case Oppgavetype.DelvisRefusjon: {
            return 'Delvis refusjon';
        }
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
        case Oppgavetype.UtbetalingTilSykmeldt: {
            return 'Utb. sykmeldt';
        }
        case Oppgavetype.Soknad: {
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

export const OppgavetypeCell: React.FC<OppgavetypeCellProps> = ({ oppgavetype }) => {
    const label = getLabelForOppgavetype(oppgavetype);
    return (
        <Cell>
            <CellContent width={144} className={styles.OppgavetypeCell}>
                <Oppgaveetikett type={oppgavetype} />
                <BodyShort>{label}</BodyShort>
            </CellContent>
        </Cell>
    );
};
