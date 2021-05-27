import { Oppgave, Periodetype } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';

import { CellContainer, SkjultSakslenke } from './rader';

export const Sakstype = React.memo(({ oppgave }: { oppgave: Oppgave }) => {
    const label = () => {
        switch (oppgave.periodetype) {
            case Periodetype.Forlengelse:
            case Periodetype.Infotrygdforlengelse:
                return 'Forlengelse';
            case Periodetype.Førstegangsbehandling:
                return 'Førstegang.';
            case Periodetype.OvergangFraInfotrygd:
                return 'Forlengelse IT';
            case Periodetype.Stikkprøve:
                return 'Stikkprøve';
            case Periodetype.RiskQa:
                return 'Risk QA';
            case Periodetype.Revurdering:
                return 'Revurdering';
        }
    };

    return (
        <CellContainer width={128}>
            <Flex alignItems="center">
                <Oppgaveetikett type={oppgave.periodetype} />
                <Normaltekst style={{ marginLeft: '12px' }}>{label()}</Normaltekst>
            </Flex>
            <SkjultSakslenke oppgave={oppgave} />
        </CellContainer>
    );
});
