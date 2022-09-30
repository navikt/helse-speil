import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Periodetype as GraphQLPeriodetype, Oppgavetype } from '@io/graphql';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

const getLabel = (type: Periodetype, erReturOppgave: boolean, erBeslutterOppgave: boolean) => {
    if (erReturOppgave) return 'Retur';
    if (erBeslutterOppgave) return 'Beslutter';

    switch (type) {
        case 'forlengelse':
        case 'infotrygdforlengelse':
            return 'Forlengelse';
        case 'førstegangsbehandling':
            return 'Førstegang.';
        case 'overgangFraIt':
            return 'Forlengelse IT';
        case 'stikkprøve':
            return 'Stikkprøve';
        case 'riskQa':
            return 'Risk QA';
        case 'revurdering':
            return 'Revurdering';
        case 'fortroligAdresse':
            return 'Fortrolig adr.';
        case 'utbetalingTilSykmeldt':
            return 'Utb. sykmeldt';
        case 'delvisRefusjon':
            return 'Delvis refusjon';
    }
};

const getEtiketttype = (periodetype: Periodetype): Oppgavetype | GraphQLPeriodetype => {
    switch (periodetype) {
        case 'forlengelse':
            return GraphQLPeriodetype.Forlengelse;
        case 'førstegangsbehandling':
            return GraphQLPeriodetype.Forstegangsbehandling;
        case 'infotrygdforlengelse':
            return GraphQLPeriodetype.Infotrygdforlengelse;
        case 'overgangFraIt':
            return GraphQLPeriodetype.OvergangFraIt;
        case 'stikkprøve':
            return Oppgavetype.Stikkprove;
        case 'riskQa':
            return Oppgavetype.RiskQa;
        case 'revurdering':
            return Oppgavetype.Revurdering;
        case 'fortroligAdresse':
            return Oppgavetype.FortroligAdresse;
        case 'utbetalingTilSykmeldt':
            return Oppgavetype.UtbetalingTilSykmeldt;
        case 'delvisRefusjon':
            return Oppgavetype.DelvisRefusjon;
    }
};

interface SakstypeProps {
    type: Periodetype;
    erBeslutterOppgave: boolean;
    erReturOppgave: boolean;
}

export const SakstypeCell = React.memo(({ type, erReturOppgave, erBeslutterOppgave }: SakstypeProps) => {
    return (
        <Cell>
            <CellContent width={130}>
                <Flex alignItems="center">
                    <Oppgaveetikett
                        type={getEtiketttype(type)}
                        erReturOppgave={erReturOppgave}
                        erBeslutterOppgave={erBeslutterOppgave}
                    />
                    <BodyShort style={{ marginLeft: '12px' }}>
                        {getLabel(type, erReturOppgave, erBeslutterOppgave)}
                    </BodyShort>
                </Flex>
            </CellContent>
        </Cell>
    );
});
