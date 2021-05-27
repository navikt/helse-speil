import { Oppgave } from 'internal-types';
import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { CellContainer, SkjultSakslenke } from './rader';

const formatertVarsel = (antallVarsler?: number) =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

export const Status = React.memo(({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={100}>
        <Element>{formatertVarsel(oppgave.antallVarsler)}</Element>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
));
