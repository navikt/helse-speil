import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { LinkRow } from '@oversikt/table/LinkRow';
import { DatoCell } from '@oversikt/table/cells/DatoCell';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { SøkerCell } from '@oversikt/table/cells/SøkerCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { PåVentCell } from '@oversikt/table/cells/påvent/PåVentCell';
import { SortKey, dateSortKey, getVisningsDato } from '@oversikt/table/state/sortation';
import { ISO_DATOFORMAT } from '@utils/date';

interface PåVentOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const PåVentOppgaveRow = ({ oppgave }: PåVentOppgaveRowProps): ReactElement => {
    const sorteringsnøkkel = useRecoilValue(dateSortKey);

    const utgåttFrist: boolean =
        oppgave.tidsfrist != null && dayjs(oppgave.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <SøkerCell name={oppgave.navn} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell
                date={getVisningsDato(oppgave, sorteringsnøkkel)}
                erUtgåttDato={sorteringsnøkkel === SortKey.Tidsfrist && utgåttFrist}
            />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell navn={oppgave.navn} påVentInfo={oppgave.paVentInfo} utgåttFrist={utgåttFrist} />
        </LinkRow>
    );
};
