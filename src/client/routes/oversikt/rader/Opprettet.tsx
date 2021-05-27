import { Oppgave } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { somDato } from '../../../mapping/vedtaksperiode';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { CellContainer, SkjultSakslenke } from './rader';

export const Opprettet = React.memo(({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={100}>
        <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
));
