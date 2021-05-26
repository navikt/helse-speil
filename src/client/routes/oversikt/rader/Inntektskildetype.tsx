import { Inntektskilde, Oppgave } from 'internal-types';
import React from 'react';

import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';

import { CellContainer, SkjultSakslenke } from './rader';

const inntektskildeLabel = (inntektskilde: Inntektskilde) => {
    switch (inntektskilde) {
        case Inntektskilde.FlereArbeidsgivere:
            return 'Flere arbeidsg.';
        case Inntektskilde.EnArbeidsgiver:
        default:
            return 'Én arbeidsgiver';
    }
};

export const Inntektskildetype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={128}>
        <TekstMedEllipsis>{inntektskildeLabel(oppgave.inntektskilde)}</TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);
