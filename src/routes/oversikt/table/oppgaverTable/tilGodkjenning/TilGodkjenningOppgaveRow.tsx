import React, { ReactElement } from 'react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { LinkRow } from '@oversikt/table/LinkRow';
import { DatoCell } from '@oversikt/table/cells/DatoCell';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { TildelingCell } from '@oversikt/table/cells/TildelingCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { PåVentCell } from '@oversikt/table/cells/påvent/PåVentCell';

interface TilGodkjenningOppgaveRowProps {
    oppgave: ApiOppgaveProjeksjon;
}

export const TilGodkjenningOppgaveRow = ({ oppgave }: TilGodkjenningOppgaveRowProps): ReactElement => {
    return (
        <LinkRow personPseudoId={oppgave.personPseudoId}>
            <TildelingCell oppgave={oppgave} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell oppgave={oppgave} />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell navn={oppgave.navn} påVentInfo={oppgave.paVentInfo} />
        </LinkRow>
    );
};
