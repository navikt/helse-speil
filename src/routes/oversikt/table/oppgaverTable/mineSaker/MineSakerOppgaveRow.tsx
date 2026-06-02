import React, { ReactElement } from 'react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { LinkRow } from '@oversikt/table/LinkRow';
import { DatoCell } from '@oversikt/table/cells/DatoCell';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { SøkerCell } from '@oversikt/table/cells/SøkerCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { PåVentCell } from '@oversikt/table/cells/påvent/PåVentCell';

interface MineSakerOppgaveRowProps {
    oppgave: ApiOppgaveProjeksjon;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps): ReactElement => {
    return (
        <LinkRow personPseudoId={oppgave.personPseudoId}>
            <SøkerCell name={oppgave.navn} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell oppgave={oppgave} />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell navn={oppgave.navn} påVentInfo={oppgave.paVentInfo} />
        </LinkRow>
    );
};
