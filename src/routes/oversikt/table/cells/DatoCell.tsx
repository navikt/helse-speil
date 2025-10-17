import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { SortKey, useDateSortValue } from '@oversikt/table/state/sortation';
import { NORSK_DATOFORMAT, somDato } from '@utils/date';

import styles from './DatoCell.module.css';

interface DatoProps {
    oppgave: ApiOppgaveProjeksjon;
    utgåttFrist: boolean;
}

export const DatoCell = ({ oppgave, utgåttFrist }: DatoProps): ReactElement => {
    const sorteringsnøkkel = useDateSortValue();
    return (
        <Table.DataCell
            className={classNames(
                styles.datocell,
                sorteringsnøkkel === SortKey.Tidsfrist && utgåttFrist && styles.utgåttfrist,
            )}
        >
            {getVisningsDato(oppgave, sorteringsnøkkel)}
        </Table.DataCell>
    );
};

const getVisningsDato = (oppgave: ApiOppgaveProjeksjon, sorteringsnøkkel: SortKey): string | null => {
    switch (sorteringsnøkkel) {
        case SortKey.BehandlingOpprettetTidspunkt:
            return somDato(oppgave.behandlingOpprettetTidspunkt).format(NORSK_DATOFORMAT);
        case SortKey.Tidsfrist:
            return oppgave.paVentInfo?.tidsfrist
                ? somDato(oppgave.paVentInfo.tidsfrist).format(NORSK_DATOFORMAT)
                : null;
        default:
            return somDato(oppgave.opprettetTidspunkt).format(NORSK_DATOFORMAT);
    }
};
