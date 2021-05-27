import { Oppgave } from 'internal-types';
import React from 'react';

import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { usePersondataSkalAnonymiseres } from '../../../state/person';

import { CellContainer, SkjultSakslenke, tooltipId } from './rader';

export const Bosted = React.memo(({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const bosted = anonymiseringEnabled ? 'Agurkheim' : oppgave.boenhet.navn;
    return (
        <CellContainer width={128} data-for={tooltipId('bosted', oppgave)} data-tip={bosted}>
            <TekstMedEllipsis>{bosted}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
            {bosted.length > 18 && <Tooltip id={tooltipId('bosted', oppgave)} />}
        </CellContainer>
    );
});
