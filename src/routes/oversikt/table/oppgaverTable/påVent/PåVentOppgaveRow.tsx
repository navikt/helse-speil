import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { LinkRow } from '@oversikt/table/LinkRow';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { PåVentDatoCell } from '@oversikt/table/cells/PåVentDatoCell';
import { SøkerCell } from '@oversikt/table/cells/SøkerCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { PåVentCell } from '@oversikt/table/cells/påvent/PåVentCell';
import { ISO_DATOFORMAT } from '@utils/date';

interface PåVentOppgaveRowProps {
    oppgave: ApiOppgaveProjeksjon;
}

export const PåVentOppgaveRow = ({ oppgave }: PåVentOppgaveRowProps): ReactElement => {
    const utgåttFrist: boolean =
        oppgave.paVentInfo?.tidsfrist != null &&
        dayjs(oppgave.paVentInfo?.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());

    return (
        <LinkRow personPseudoId={oppgave.personPseudoId}>
            <SøkerCell name={oppgave.navn} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <PåVentDatoCell oppgave={oppgave} utgåttFrist={utgåttFrist} />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell navn={oppgave.navn} påVentInfo={oppgave.paVentInfo} utgåttFrist={utgåttFrist} />
        </LinkRow>
    );
};
