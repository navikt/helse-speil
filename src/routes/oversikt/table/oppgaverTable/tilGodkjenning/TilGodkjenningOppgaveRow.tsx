import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { LinkRow } from '@oversikt/table/LinkRow';
import { DatoCell } from '@oversikt/table/cells/DatoCell';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { TildelingCell } from '@oversikt/table/cells/TildelingCell';
import { PåVentCell } from '@oversikt/table/cells/notat/PåVentCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { SortKey, dateSortKey, getVisningsDato } from '@oversikt/table/state/sortation';
import { ISO_DATOFORMAT } from '@utils/date';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const TilGodkjenningOppgaveRow = ({ oppgave }: TilGodkjenningOppgaveRowProps): ReactElement => {
    const sorteringsnøkkel = useRecoilValue(dateSortKey);

    const utgåttFrist: boolean =
        oppgave.paVentInfo?.tidsfrist != null &&
        dayjs(oppgave.paVentInfo.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <TildelingCell oppgave={oppgave} />
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
