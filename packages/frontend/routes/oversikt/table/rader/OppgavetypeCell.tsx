import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Oppgavetype, Periodetype } from '@io/graphql';

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
        default: {
            return 'Ukjent';
        }
    }
};

const getLabelForPeriodetype = (type: Periodetype): string => {
    switch (type) {
        case Periodetype.Infotrygdforlengelse:
        case Periodetype.Forlengelse: {
            return 'Forlengelse';
        }
        case Periodetype.Forstegangsbehandling: {
            return 'Førstegang.';
        }
        case Periodetype.OvergangFraIt: {
            return 'Forlengelse IT';
        }
    }
};

interface OppgavetypeCellProps {
    oppgavetype: Oppgavetype;
    periodetype: Periodetype;
}

export const OppgavetypeCell: React.FC<OppgavetypeCellProps> = ({ oppgavetype, periodetype }) => {
    const label = oppgavetype === 'SOKNAD' ? getLabelForPeriodetype(periodetype) : getLabelForOppgavetype(oppgavetype);
    const type = oppgavetype === 'SOKNAD' ? periodetype : oppgavetype;
    return (
        <Cell>
            <CellContent width={130}>
                <div className={styles.OppgavetypeCell}>
                    <Oppgaveetikett type={type} />
                    <BodyShort>{label}</BodyShort>
                </div>
            </CellContent>
        </Cell>
    );
};
